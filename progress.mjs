import {
  APP_VERSION,
  ASSESSMENTS,
  ASSESSMENT_ORDER,
  TOOLS,
} from './data.mjs';
import {
  profilesFor,
  recommendationFor,
  resultHeading,
  resultIntro,
} from './scoring.mjs';

export const PROGRESS_VERSION = 1;
export const PROGRESS_KEY = 'familyfin.decision-awareness.v1.progress';

const CLASSIFICATION_KINDS = new Set(['unique', 'shared', 'mixed', 'insufficient']);
const EXTENSION_IDS = ASSESSMENT_ORDER.filter((id) => id !== 'entry');
const SYNTHESIS_LABELS = {
  clarity: '財務資訊',
  pressure: '壓力反應',
  family: '家人金錢界線',
  plan: '計畫行動',
};

export function emptyProgress() {
  return {
    version: PROGRESS_VERSION,
    instrumentVersion: APP_VERSION,
    results: {},
  };
}

function knownKeys(assessment, values) {
  if (!Array.isArray(values)) return [];
  const allowed = new Set(Object.keys(assessment.profiles));
  return [...new Set(values.filter((value) => typeof value === 'string' && allowed.has(value)))];
}

function normalizedSnapshot(raw, expectedId) {
  if (!raw || typeof raw !== 'object' || raw.assessmentId !== expectedId) return null;
  const assessment = ASSESSMENTS[expectedId];
  if (!assessment || !raw.classification || !CLASSIFICATION_KINDS.has(raw.classification.kind)) return null;
  const classification = {
    kind: raw.classification.kind,
    primaryKeys: knownKeys(assessment, raw.classification.primaryKeys),
    secondaryKeys: knownKeys(assessment, raw.classification.secondaryKeys),
    focusKeys: knownKeys(assessment, raw.classification.focusKeys),
  };
  const recommendedAssessmentIds = Array.isArray(raw.recommendedAssessmentIds)
    ? [...new Set(raw.recommendedAssessmentIds
      .filter((id) => id !== 'entry' && ASSESSMENTS[id]))].slice(0, 2)
    : [];
  return {
    assessmentId: expectedId,
    classification,
    recommendedAssessmentIds,
  };
}

export function normalizedProgress(raw) {
  if (!raw || typeof raw !== 'object'
    || raw.version !== PROGRESS_VERSION
    || raw.instrumentVersion !== APP_VERSION
    || !raw.results || typeof raw.results !== 'object') return emptyProgress();
  const results = {};
  ASSESSMENT_ORDER.forEach((id) => {
    const snapshot = normalizedSnapshot(raw.results[id], id);
    if (snapshot) results[id] = snapshot;
  });
  return {
    version: PROGRESS_VERSION,
    instrumentVersion: APP_VERSION,
    results,
  };
}

export function snapshotResult(result) {
  if (!result?.assessment || !ASSESSMENTS[result.assessmentId]) return null;
  return normalizedSnapshot({
    assessmentId: result.assessmentId,
    classification: result.classification,
    recommendedAssessmentIds: result.recommendedAssessmentIds ?? [],
  }, result.assessmentId);
}

export function progressWithResult(progress, result) {
  const current = normalizedProgress(progress);
  const snapshot = snapshotResult(result);
  if (!snapshot) return current;
  return {
    ...current,
    results: {
      ...current.results,
      [snapshot.assessmentId]: snapshot,
    },
  };
}

export function resultFromSnapshot(snapshot) {
  const normalized = normalizedSnapshot(snapshot, snapshot?.assessmentId);
  if (!normalized) return null;
  const assessment = ASSESSMENTS[normalized.assessmentId];
  return {
    assessmentId: assessment.id,
    assessment,
    kind: assessment.kind,
    classification: normalized.classification,
    recommendedAssessmentIds: normalized.recommendedAssessmentIds,
    restoredFromProgress: true,
  };
}

export function completedAssessmentIds(progress) {
  const current = normalizedProgress(progress);
  return ASSESSMENT_ORDER.filter((id) => Boolean(current.results[id]));
}

export function completedCount(progress) {
  return completedAssessmentIds(progress).length;
}

export function resultSummary(snapshot) {
  const result = resultFromSnapshot(snapshot);
  if (!result) return null;
  return {
    assessmentId: result.assessmentId,
    heading: resultHeading(result),
    intro: resultIntro(result),
  };
}

function withoutEnding(value = '') {
  return value.trim().replace(/[。；;]+$/u, '');
}

function withoutLead(value = '') {
  return withoutEnding(value)
    .replace(/^這能/u, '')
    .replace(/^也可以留意[：:]\s*/u, '')
    .replace(/^做決定前，?\s*/u, '')
    .replace(/^生活有變化時，?\s*/u, '')
    .replace(/^會/u, '');
}

function synthesisProfiles(result) {
  if (!result || result.classification.kind === 'insufficient') return [];
  const keys = result.classification.primaryKeys.length
    ? result.classification.primaryKeys
    : result.classification.focusKeys;
  return keys.map((key) => result.assessment.profiles[key]).filter(Boolean);
}

function synthesisAction(result) {
  const profiles = synthesisProfiles(result);
  if (result.classification.kind === 'insufficient') return '這次先不勉強歸納單一做法';
  if (result.classification.kind === 'mixed') {
    return profiles.length
      ? `會依情境在「${profiles.slice(0, 3).map(({ name }) => name).join('」、「')}」等做法間調整`
      : '會依不同情境調整做法';
  }
  if (result.classification.kind === 'shared') {
    return `會同時顧到「${profiles.map(({ name }) => name).join('」與「')}」`;
  }
  const profile = profiles[0];
  if (!profile) return '這次先不勉強歸納單一做法';
  const source = result.assessment.kind === 'entry_tendency' ? profile.meaning : profile.action;
  return withoutLead(source);
}

function synthesisHelp(result) {
  const profiles = synthesisProfiles(result);
  if (!profiles.length) return null;
  if (result.classification.kind === 'mixed') {
    return '依不同情境保留調整做法的空間';
  }
  if (result.classification.kind === 'shared') {
    return '都在回應當時重視的事';
  }
  return withoutLead(profiles[0].help);
}

function synthesisWatch(result) {
  const profiles = synthesisProfiles(result);
  if (!profiles.length) return null;
  if (result.classification.kind === 'mixed') {
    return '做法隨情境改變時，也可以確認目前最想守住的事與下一步';
  }
  if (result.classification.kind === 'shared') {
    return profiles.slice(0, 2)
      .map((profile) => `偏向「${profile.name}」時，${withoutLead(profile.watch)}`)
      .join('；');
  }
  return withoutLead(profiles[0].watch);
}

function orderedExtensionIds(progress) {
  const preferred = progress.results.entry?.recommendedAssessmentIds ?? [];
  return [...new Set([...preferred, ...EXTENSION_IDS])];
}

function resultCandidate(result, assessmentId) {
  if (!result || result.classification.kind === 'insufficient') return null;
  if (result.classification.kind === 'unique') {
    const profileKey = result.classification.primaryKeys[0];
    const recommendation = recommendationFor(result, profileKey);
    return recommendation?.primary
      ? { tool: recommendation.primary, assessmentId, basis: 'result' }
      : null;
  }
  const fallback = TOOLS[result.assessment.fallbackTool];
  return fallback ? { tool: fallback, assessmentId, basis: 'theme' } : null;
}

function additionalCandidates(result, assessmentId) {
  if (!result || result.classification.kind === 'insufficient') return [];
  const profileKeys = result.classification.primaryKeys.length
    ? result.classification.primaryKeys
    : result.classification.focusKeys;
  const candidates = [];
  profileKeys.forEach((profileKey) => {
    const recommendation = recommendationFor(result, profileKey);
    if (!recommendation) return;
    if (result.classification.kind !== 'unique' && recommendation.primary) {
      candidates.push({ tool: recommendation.primary, assessmentId, basis: 'result' });
    }
    recommendation.others.forEach((tool) => {
      candidates.push({ tool, assessmentId, basis: 'result' });
    });
  });
  return candidates;
}

export function completionToolRecommendations(progress, limit = 3) {
  const current = normalizedProgress(progress);
  if (completedCount(current) !== ASSESSMENT_ORDER.length || limit < 1) {
    return { items: [], mode: 'none' };
  }
  const topicOrder = orderedExtensionIds(current);
  const results = Object.fromEntries(topicOrder.map((id) => [id, resultFromSnapshot(current.results[id])]));
  const candidates = [];

  // Give every completed topic one turn before another topic can add a second tool.
  topicOrder.forEach((id) => {
    const candidate = resultCandidate(results[id], id);
    if (candidate) candidates.push(candidate);
  });
  // When a topic has no usable classification, its fallback gets one honest turn
  // before any other topic contributes a second result-led candidate.
  topicOrder.forEach((id) => {
    if (results[id]?.classification.kind !== 'insufficient') return;
    const fallback = TOOLS[ASSESSMENTS[id]?.fallbackTool];
    if (fallback) candidates.push({ tool: fallback, assessmentId: id, basis: 'fallback' });
  });
  topicOrder.forEach((id) => candidates.push(...additionalCandidates(results[id], id)));

  // A completed-but-insufficient topic may only contribute a clearly generic fallback.
  topicOrder.forEach((id) => {
    const fallback = TOOLS[ASSESSMENTS[id]?.fallbackTool];
    if (fallback) candidates.push({ tool: fallback, assessmentId: id, basis: 'fallback' });
  });

  const seen = new Set();
  const items = [];
  for (const candidate of candidates) {
    const key = candidate.tool?.href;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push(candidate);
    if (items.length === limit) break;
  }
  const fallbackCount = items.filter(({ basis }) => basis === 'fallback').length;
  return {
    items,
    mode: fallbackCount === items.length ? 'general' : fallbackCount ? 'mixed' : 'result',
  };
}

export function combinedAnalysisModel(progress) {
  const current = normalizedProgress(progress);
  if (completedCount(current) !== ASSESSMENT_ORDER.length) return null;
  const items = ASSESSMENT_ORDER.map((id) => {
    const result = resultFromSnapshot(current.results[id]);
    return {
      id,
      title: result.assessment.title,
      heading: resultHeading(result),
      intro: resultIntro(result),
      kind: result.classification.kind,
      action: synthesisAction(result),
      help: synthesisHelp(result),
      watch: synthesisWatch(result),
    };
  });
  const entryResult = resultFromSnapshot(current.results.entry);
  const itemById = Object.fromEntries(items.map((item) => [item.id, item]));
  const topicOrder = orderedExtensionIds(current);
  const focusTopicId = topicOrder.find((id) => itemById[id]?.kind !== 'insufficient') ?? topicOrder[0];
  const focusTopic = itemById[focusTopicId];
  const focusResult = resultFromSnapshot(current.results[focusTopicId]);
  const focusProfile = focusResult?.classification.kind === 'unique'
    ? synthesisProfiles(focusResult)[0]
    : null;
  const strengthClause = (item, label) => {
    if (!item?.help) return null;
    if (item.kind === 'shared') return `在${label}，「${item.heading}」這兩個並列方向${item.help}`;
    if (item.kind === 'mixed') return `在${label}，不同情境帶出的做法讓你${item.help}`;
    return `在${label}，「${item.heading}」這個做法能${item.help}`;
  };
  const strengthClauses = [
    strengthClause(itemById.entry, '做決定的起點'),
    strengthClause(focusTopic, SYNTHESIS_LABELS[focusTopicId]),
  ].filter(Boolean);
  const strength = strengthClauses.length
    ? `${strengthClauses.join('；')}。這些做法可以繼續保留，作為之後做決定時的支點。`
    : '這次各面向呈現不同線索；能依情境調整，本身就是可以繼續保留的能力。';
  const watches = [...new Set([itemById.pressure.watch, itemById.family.watch].filter(Boolean))];
  const watch = watches.length
    ? `${watches.length > 1 ? '當壓力與家人需要同時進入決定時，可以一起留意' : '在這次可整理的情境裡，可以先留意'}：${watches.join('；')}。這不代表做錯，而是提醒自己在回應前，也替資源與界線留一個確認的位置。`
    : '有些情境這次沒有足夠資訊可整理，因此不把缺少的部分當成問題；先從已經看見的做法開始就好。';
  const nextStep = focusProfile?.step
    ? focusProfile.step
    : focusTopic
      ? `先從「${SYNTHESIS_LABELS[focusTopicId]}」裡選一個現在最想整理的方向，只做一個小步驟。`
      : '先選一個現在最想整理的主題，只做一個小步驟。';
  return {
    items,
    entryKind: entryResult.classification.kind,
    entryHeading: resultHeading(entryResult),
    synthesis: {
      overview: `放在一起看，你這次的決策節奏比較像：做決定時，${itemById.entry.action}；整理財務資訊時，${itemById.clarity.action}；壓力來時，${itemById.pressure.action}；牽涉家人或共同支出時，${itemById.family.action}；要讓計畫往前時，${itemById.plan.action}。`,
      connections: [
        {
          label: '從資訊走到行動',
          text: itemById.clarity.kind === 'insufficient' || itemById.plan.kind === 'insufficient'
            ? `「財務資訊」與「計畫行動」中，有${itemById.clarity.kind === 'insufficient' && itemById.plan.kind === 'insufficient' ? '兩項' : '一項'}這次沒有足夠情境可歸納。先保留空白，不把缺答解讀成卡點，也不推論兩者如何連動。`
            : `整理資訊時，${itemById.clarity.action}；要讓計畫往前時，${itemById.plan.action}。兩項放在一起，呈現的是你目前如何從看清現況走到下一步。`,
          sourceAssessmentIds: ['clarity', 'plan'],
        },
        {
          label: '壓力與關係如何改變順序',
          text: itemById.pressure.kind === 'insufficient' || itemById.family.kind === 'insufficient'
            ? `「壓力反應」與「家人金錢界線」中，有${itemById.pressure.kind === 'insufficient' && itemById.family.kind === 'insufficient' ? '兩項' : '一項'}這次沒有足夠情境可歸納。先保留各自結果，不把缺答補成兩者之間的關係。`
            : `壓力出現時，${itemById.pressure.action}；家人或共同支出進入決定時，${itemById.family.action}。兩種情境同時出現時，原本的先後順序可能跟著調整。`,
          sourceAssessmentIds: ['pressure', 'family'],
        },
      ],
      strength,
      strengthSourceAssessmentIds: ['entry', focusTopicId].filter(Boolean),
      watch,
      watchSourceAssessmentIds: ['pressure', 'family'],
      nextStep,
      nextStepSourceAssessmentIds: focusTopicId ? [focusTopicId] : [],
    },
  };
}
