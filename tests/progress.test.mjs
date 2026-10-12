import test from 'node:test';
import assert from 'node:assert/strict';
import { ASSESSMENTS, ATTEMPT_VERSION, NOT_ENCOUNTERED } from '../data.mjs';
import {
  combinedAnalysisModel,
  completionToolRecommendations,
  completedAssessmentIds,
  completedCount,
  emptyProgress,
  normalizedProgress,
  progressWithResult,
  resultFromSnapshot,
  snapshotResult,
} from '../progress.mjs';
import { scoreAssessment } from '../scoring.mjs';

function resultFor(assessmentId, values) {
  const assessment = ASSESSMENTS[assessmentId];
  const answers = values.map((value, index) => value === NOT_ENCOUNTERED
    ? NOT_ENCOUNTERED
    : assessment.questions[index].options.find((option) => option.value === value)?.id);
  return scoreAssessment({
    version: ATTEMPT_VERSION,
    assessmentId,
    answers,
    finished: true,
  });
}

test('result snapshots retain only display classification and entry routing', () => {
  const result = resultFor('entry', [
    'security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security',
  ]);
  const snapshot = snapshotResult(result);
  assert.equal(snapshot.assessmentId, 'entry');
  assert.deepEqual(snapshot.classification.primaryKeys, ['security']);
  assert.deepEqual(snapshot.recommendedAssessmentIds, ['plan']);
  const serialized = JSON.stringify(snapshot);
  for (const forbidden of ['answers', 'selections', 'counts', 'rates', 'average', 'answerId', 'evidence']) {
    assert.doesNotMatch(serialized, new RegExp(forbidden));
  }
});

test('completed state is derived from snapshots and a retest atomically replaces one topic', () => {
  const first = resultFor('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']);
  const second = resultFor('plan', ['A1', 'A1', 'A1', 'A1', 'A5', 'A5']);
  const afterFirst = progressWithResult(emptyProgress(), first);
  const afterSecond = progressWithResult(afterFirst, second);
  assert.equal(completedCount(afterSecond), 1);
  assert.deepEqual(completedAssessmentIds(afterSecond), ['plan']);
  assert.deepEqual(afterSecond.results.plan.classification.primaryKeys, ['A1']);
});

test('one damaged result is ignored without removing other valid topics', () => {
  const entry = resultFor('entry', [
    'security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security',
  ]);
  const pressure = resultFor('pressure', ['P1', 'P1', 'P1', 'P1', 'P2', 'P2']);
  let progress = progressWithResult(emptyProgress(), entry);
  progress = progressWithResult(progress, pressure);
  const normalized = normalizedProgress({
    ...progress,
    results: { ...progress.results, pressure: { assessmentId: 'wrong' } },
  });
  assert.deepEqual(completedAssessmentIds(normalized), ['entry']);
});

test('stored classification restores a result summary without raw selections', () => {
  const result = resultFor('clarity', [3, 3, 3, 2, 2, 2]);
  const restored = resultFromSnapshot(snapshotResult(result));
  assert.equal(restored.assessmentId, 'clarity');
  assert.deepEqual(restored.classification.primaryKeys, ['map']);
  assert.equal(restored.restoredFromProgress, true);
  assert.equal(restored.selections, undefined);
});

test('five completed snapshots produce a cross-topic synthesis and update after a retest', () => {
  const results = [
    resultFor('entry', ['security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security']),
    resultFor('clarity', [3, 3, 3, 2, 2, 2]),
    resultFor('pressure', ['P1', 'P1', 'P1', 'P1', 'P2', 'P2']),
    resultFor('family', ['F2', 'F2', 'F2', 'F2', 'F1', 'F1']),
    resultFor('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']),
  ];
  let progress = emptyProgress();
  results.slice(0, 4).forEach((result) => { progress = progressWithResult(progress, result); });
  assert.equal(combinedAnalysisModel(progress), null);
  progress = progressWithResult(progress, results[4]);
  const combined = combinedAnalysisModel(progress);
  assert.equal(combined.items.length, 5);
  assert.deepEqual(combined.items.map(({ id }) => id), ['entry', 'clarity', 'pressure', 'family', 'plan']);
  assert.equal(combined.items.find(({ id }) => id === 'plan').heading, '想準備完整再開始');
  assert.match(combined.synthesis.overview, /做決定時.+整理財務資訊時.+壓力來時.+家人或共同支出.+計畫往前/u);
  assert.deepEqual(combined.synthesis.connections.map(({ sourceAssessmentIds }) => sourceAssessmentIds), [
    ['clarity', 'plan'], ['pressure', 'family'],
  ]);
  assert.match(combined.synthesis.strength, /可以繼續保留/u);
  assert.match(combined.synthesis.watch, /壓力與家人需要/u);
  assert.equal(combined.synthesis.nextStep, '先寫下目標金額、目前已有金額，以及每月可以準備多少。');

  const retest = resultFor('plan', ['A1', 'A1', 'A1', 'A1', 'A5', 'A5']);
  progress = progressWithResult(progress, retest);
  const updated = combinedAnalysisModel(progress);
  assert.equal(updated.items.find(({ id }) => id === 'plan').heading, '先把計畫縮小到做得下去');
  assert.equal(updated.synthesis.nextStep, '寫下目前最重要的目標、需要金額、希望完成的時間，以及本月能先準備多少。');
});

test('completion tools are three distinct result-led choices and change with the five-part pattern', () => {
  const scenarios = [
    [
      resultFor('entry', ['security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security']),
      resultFor('clarity', [3, 3, 3, 2, 2, 2]),
      resultFor('pressure', ['P1', 'P1', 'P1', 'P1', 'P2', 'P2']),
      resultFor('family', ['F2', 'F2', 'F2', 'F2', 'F1', 'F1']),
      resultFor('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']),
    ],
    [
      resultFor('entry', ['present', 'achievement', 'relationship', 'action', 'present', 'present', 'adaptive', 'present']),
      resultFor('clarity', [0, 0, 0, 0, 1, 1]),
      resultFor('pressure', ['P5', 'P5', 'P5', 'P5', 'P2', 'P2']),
      resultFor('family', ['F3', 'F3', 'F3', 'F3', 'F1', 'F1']),
      resultFor('plan', ['A1', 'A1', 'A1', 'A1', 'A5', 'A5']),
    ],
  ];
  const models = scenarios.map((results) => {
    let progress = emptyProgress();
    results.forEach((result) => { progress = progressWithResult(progress, result); });
    return completionToolRecommendations(progress);
  });
  models.forEach((model) => {
    assert.equal(model.items.length, 3);
    assert.equal(new Set(model.items.map(({ tool }) => tool.href)).size, 3);
    assert(new Set(model.items.map(({ assessmentId }) => assessmentId)).size >= 2);
    assert.equal(model.mode, 'result');
  });
  assert.notDeepEqual(
    models[0].items.map(({ tool }) => tool.name),
    models[1].items.map(({ tool }) => tool.name),
  );
});

test('shared and mixed topics do not silently choose one tied profile for the first tool', () => {
  let progress = emptyProgress();
  [
    resultFor('entry', ['present', 'achievement', 'relationship', 'action', 'present', 'present', 'adaptive', 'present']),
    resultFor('clarity', [3, 3, 3, 2, 2, 2]),
    resultFor('pressure', ['P2', 'P2', 'P2', 'P3', 'P3', 'P3']),
    resultFor('family', ['F1', 'F1', 'F2', 'F2', 'F3', 'F3']),
    resultFor('plan', ['A1', 'A1', 'A1', 'A1', 'A5', 'A5']),
  ].forEach((result) => { progress = progressWithResult(progress, result); });
  const model = completionToolRecommendations(progress);
  const pressure = model.items.find(({ assessmentId }) => assessmentId === 'pressure');
  assert.equal(pressure?.tool.name, '記帳助理');
  assert.equal(pressure?.basis, 'theme');
  const synthesis = combinedAnalysisModel(progress).synthesis;
  assert.match(synthesis.overview, /會同時顧到/u);
  assert.match(synthesis.overview, /會依情境/u);
});

test('four insufficient extensions use three honest generic fallbacks', () => {
  let progress = emptyProgress();
  [
    resultFor('entry', ['security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security']),
    resultFor('clarity', Array(6).fill(NOT_ENCOUNTERED)),
    resultFor('pressure', Array(6).fill(NOT_ENCOUNTERED)),
    resultFor('family', Array(6).fill(NOT_ENCOUNTERED)),
    resultFor('plan', Array(6).fill(NOT_ENCOUNTERED)),
  ].forEach((result) => { progress = progressWithResult(progress, result); });
  const model = completionToolRecommendations(progress);
  assert.equal(model.mode, 'general');
  assert.equal(model.items.length, 3);
  assert.equal(new Set(model.items.map(({ tool }) => tool.href)).size, 3);
  assert(model.items.every(({ basis }) => basis === 'fallback'));
  const synthesis = combinedAnalysisModel(progress).synthesis;
  assert(synthesis.connections.every(({ text }) => /沒有足夠情境可歸納/u.test(text)));
  assert(synthesis.connections.every(({ text }) => /不推論|不把缺答解讀|不把缺答補成/u.test(text)));
});

test('an insufficient snapshot still counts as a completed angle without inventing a direction', () => {
  const family = resultFor('family', ['F1', 'F1', 'F1', 'F2', NOT_ENCOUNTERED, NOT_ENCOUNTERED]);
  assert.equal(family.classification.kind, 'insufficient');
  let progress = emptyProgress();
  [
    resultFor('entry', ['security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security']),
    resultFor('clarity', [3, 3, 3, 2, 2, 2]),
    resultFor('pressure', ['P1', 'P1', 'P1', 'P1', 'P2', 'P2']),
    family,
    resultFor('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']),
  ].forEach((result) => { progress = progressWithResult(progress, result); });
  const familyItem = combinedAnalysisModel(progress).items.find(({ id }) => id === 'family');
  assert.equal(familyItem.kind, 'insufficient');
  assert.equal(familyItem.heading, '這次先不歸納單一方向');
});
