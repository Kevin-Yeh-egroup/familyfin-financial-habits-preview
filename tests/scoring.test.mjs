import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASSESSMENTS,
  ATTEMPT_VERSION,
  NOT_ENCOUNTERED,
} from '../data.mjs';
import {
  entryTypeModel,
  evidenceFor,
  normalizedAttempt,
  recommendationFor,
  resultAnalysisModel,
  resultHeading,
  scoreAssessment,
} from '../scoring.mjs';

function optionIdFor(question, value) {
  const option = question.options.find((candidate) => candidate.value === value);
  assert.ok(option, `missing option value ${value} in ${question.id}`);
  return option.id;
}

function attemptFor(assessmentId, values) {
  const assessment = ASSESSMENTS[assessmentId];
  assert.equal(values.length, assessment.questions.length);
  return {
    version: ATTEMPT_VERSION,
    assessmentId,
    answers: values.map((value, index) => value === NOT_ENCOUNTERED
      ? NOT_ENCOUNTERED
      : optionIdFor(assessment.questions[index], value)),
    finished: true,
  };
}

test('registry contains one 8-question entry and four 6-question extensions', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(ASSESSMENTS).map(([id, assessment]) => [id, assessment.questions.length])),
    { entry: 8, clarity: 6, pressure: 6, family: 6, plan: 6 },
  );
  assert.equal(ASSESSMENTS.entry.minimumValid, 6);
  for (const id of ['clarity', 'pressure', 'family', 'plan']) assert.equal(ASSESSMENTS[id].minimumValid, 5);
});

test('the eight entry tendencies each have four opportunities and rotated positions', () => {
  const counts = {};
  const positions = {};
  ASSESSMENTS.entry.questions.forEach((question) => question.options.forEach((option, index) => {
    counts[option.value] = (counts[option.value] ?? 0) + 1;
    positions[option.value] = new Set([...(positions[option.value] ?? []), index]);
  }));
  assert.deepEqual(new Set(Object.values(counts)), new Set([4]));
  for (const seen of Object.values(positions)) assert.ok(seen.size >= 2);
});

test('normalization fails closed for stale versions, unknown assessments, and invalid option ids', () => {
  const valid = attemptFor('entry', ['security', 'achievement', 'relationship', 'planning', 'present', 'adaptive', 'action', 'pause']);
  assert.ok(normalizedAttempt(valid));
  assert.equal(normalizedAttempt({ ...valid, version: 9 }), null);
  assert.equal(normalizedAttempt({ ...valid, assessmentId: 'unknown' }), null);
  assert.equal(normalizedAttempt({ ...valid, answers: ['invented', ...valid.answers.slice(1)] }), null);
  assert.equal(normalizedAttempt({ ...valid, finished: false }), null);
});

test('entry classification uses valid opportunities and a two-selection eligibility floor', () => {
  const result = scoreAssessment(attemptFor('entry', [
    'security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security',
  ]));
  assert.equal(result.classification.kind, 'unique');
  assert.deepEqual(result.classification.primaryKeys, ['security']);
  assert.deepEqual(result.classification.secondaryKeys, ['planning']);
  assert.deepEqual(result.recommendedAssessmentIds, ['plan']);
  assert.equal(result.counts.security, 4);
  assert.equal(result.opportunities.security, 4);
  assert.equal(result.rates.security, 1);
});

test('entry preserves an exact two-way tie and never uses a hidden tie-break', () => {
  const result = scoreAssessment(attemptFor('entry', [
    'security', 'planning', 'security', 'planning', 'achievement', 'present', 'action', 'pause',
  ]));
  assert.equal(result.classification.kind, 'shared');
  assert.deepEqual(new Set(result.classification.primaryKeys), new Set(['security', 'planning']));
  assert.deepEqual(result.recommendedAssessmentIds, ['plan']);
  assert.match(resultHeading(result), /重視安心與準備/);
  assert.match(resultHeading(result), /先比較再決定/);
});

test('entry skips reduce only the affected valid opportunities', () => {
  const result = scoreAssessment(attemptFor('entry', [
    NOT_ENCOUNTERED, 'planning', 'relationship', 'security', 'present', 'adaptive', 'action', NOT_ENCOUNTERED,
  ]));
  assert.equal(result.validCount, 6);
  assert.equal(result.opportunities.security, 2);
  assert.equal(result.opportunities.achievement, 3);
  assert.equal(result.classification.kind, 'mixed');
});

test('entry requires six scored situations', () => {
  const result = scoreAssessment(attemptFor('entry', [
    'security', 'planning', 'relationship', 'security', 'present', NOT_ENCOUNTERED, NOT_ENCOUNTERED, NOT_ENCOUNTERED,
  ]));
  assert.equal(result.validCount, 5);
  assert.equal(result.classification.kind, 'insufficient');
  assert.deepEqual(result.recommendedAssessmentIds, []);
});

test('entry type presentation maps all eight types and preserves non-forced states', () => {
  const expected = {
    security: '安全規劃型',
    present: '當下滿足型',
    planning: '精算判斷型',
    action: '行動嘗試型',
    relationship: '關係照顧型',
    achievement: '成就證明型',
    adaptive: '彈性應變型',
    pause: '延後面對型',
  };
  const resultFor = (classification) => ({
    assessmentId: 'entry',
    assessment: ASSESSMENTS.entry,
    classification,
  });

  for (const [key, typeName] of Object.entries(expected)) {
    const model = entryTypeModel(resultFor({
      kind: 'unique', primaryKeys: [key], secondaryKeys: [], focusKeys: [key],
    }));
    assert.equal(model.groups[0].names[0], typeName);
  }

  const uniqueWithSecondary = entryTypeModel(resultFor({
    kind: 'unique', primaryKeys: ['security'], secondaryKeys: ['planning'], focusKeys: ['security', 'planning'],
  }));
  assert.deepEqual(uniqueWithSecondary.groups.map((group) => group.names), [['安全規劃型'], ['精算判斷型']]);

  const shared = entryTypeModel(resultFor({
    kind: 'shared', primaryKeys: ['security', 'planning'], secondaryKeys: [], focusKeys: ['security', 'planning'],
  }));
  assert.deepEqual(shared.groups[0].names, ['安全規劃型', '精算判斷型']);

  const mixed = entryTypeModel(resultFor({
    kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: ['present', 'adaptive', 'pause'],
  }));
  assert.deepEqual(mixed.groups[0].names, ['當下滿足型', '彈性應變型', '延後面對型']);

  const openMixed = entryTypeModel(resultFor({
    kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: [],
  }));
  assert.equal(openMixed.message, '這次沒有一個傾向明顯重複出現');

  const insufficient = entryTypeModel(resultFor({
    kind: 'insufficient', primaryKeys: [], secondaryKeys: [], focusKeys: [],
  }));
  assert.equal(insufficient.message, '這次先不套用類型');
});

test('clarity uses only valid 0-3 answers and keeps the mean internal', () => {
  const map = scoreAssessment(attemptFor('clarity', [3, 3, 3, 2, 2, 2]));
  const outline = scoreAssessment(attemptFor('clarity', [3, 2, 2, 2, 1, 1]));
  const onDemand = scoreAssessment(attemptFor('clarity', [1, 1, 1, 1, 1, NOT_ENCOUNTERED]));
  const current = scoreAssessment(attemptFor('clarity', [0, 0, 1, 0, 1, NOT_ENCOUNTERED]));
  assert.deepEqual(map.classification.primaryKeys, ['map']);
  assert.deepEqual(outline.classification.primaryKeys, ['outline']);
  assert.deepEqual(onDemand.classification.primaryKeys, ['on_demand']);
  assert.deepEqual(current.classification.primaryKeys, ['current']);
  assert.equal(onDemand.validCount, 5);
  assert.equal(evidenceFor(map).length, 3);
});

test('dominant-pattern extensions support unique, 3-3 shared, and dispersed results', () => {
  const unique = scoreAssessment(attemptFor('pressure', ['P1', 'P1', 'P1', 'P1', 'P2', 'P2']));
  const shared = scoreAssessment(attemptFor('pressure', ['P1', 'P2', 'P1', 'P2', 'P1', 'P2']));
  const mixed = scoreAssessment(attemptFor('pressure', ['P1', 'P2', 'P3', 'P1', 'P2', 'P3']));
  const mixedWithOneRepeatedDirection = scoreAssessment(attemptFor('pressure', ['P1', 'P1', 'P2', 'P3', 'P4', 'P5']));
  assert.equal(unique.classification.kind, 'unique');
  assert.deepEqual(unique.classification.primaryKeys, ['P1']);
  assert.deepEqual(unique.classification.secondaryKeys, ['P2']);
  assert.equal(shared.classification.kind, 'shared');
  assert.deepEqual(new Set(shared.classification.primaryKeys), new Set(['P1', 'P2']));
  assert.equal(mixed.classification.kind, 'mixed');
  assert.deepEqual(new Set(mixed.classification.focusKeys), new Set(['P1', 'P2', 'P3']));
  assert.equal(mixedWithOneRepeatedDirection.classification.kind, 'mixed');
  assert.deepEqual(mixedWithOneRepeatedDirection.classification.focusKeys, ['P1']);
  assert.equal(resultAnalysisModel(mixedWithOneRepeatedDirection).profiles.length, 1);
  assert.equal(resultAnalysisModel(shared).profiles.length, 2);
  assert.equal(resultAnalysisModel(mixed).profiles.length, 3);
  for (const profile of resultAnalysisModel(mixed).profiles) {
    assert.ok(profile.action && profile.help && profile.watch && profile.narrative);
  }
});

test('dominant-pattern extensions need five valid answers before recommending a tool', () => {
  const result = scoreAssessment(attemptFor('family', ['F1', 'F1', 'F1', 'F2', NOT_ENCOUNTERED, NOT_ENCOUNTERED]));
  assert.equal(result.classification.kind, 'insufficient');
  assert.equal(recommendationFor(result), null);
  assert.deepEqual(resultAnalysisModel(result).profiles, []);
});

test('tool routing follows the user-selected result direction and returns at most two other resources', () => {
  const result = scoreAssessment(attemptFor('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']));
  const recommendation = recommendationFor(result);
  assert.equal(recommendation.primary.name, '儲蓄目標試算');
  assert.ok(recommendation.others.length <= 2);
  assert.match(recommendation.primary.href, /^https:\/\/www\.familyfinhealth\.com\//);
});

test('evidence is grounded only in options actually selected', () => {
  const result = scoreAssessment(attemptFor('entry', [
    'security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security',
  ]));
  const evidence = evidenceFor(result, 'security', 10);
  assert.equal(evidence.length, 4);
  for (const item of evidence) {
    assert.ok(result.selections.some((selection) => selection.option?.text === item.response));
  }
});
