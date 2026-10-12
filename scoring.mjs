import {
  ASSESSMENTS,
  ASSESSMENT_ORDER,
  ATTEMPT_VERSION,
  NOT_ENCOUNTERED,
  TOOLS,
} from './data.mjs';

export const SCORING_VERSION = 'decision-awareness-1plus4-v1.0';
export const RESULT_VERSION = 'answer-grounded-summary-v1.2';
export const TOOL_ROUTE_VERSION = 'extension-and-completion-route-v1.1';

export function assessmentFor(id) {
  return ASSESSMENTS[id] ?? null;
}

export function emptyAttempt(assessmentId = 'entry') {
  const assessment = assessmentFor(assessmentId) ?? ASSESSMENTS.entry;
  return {
    version: ATTEMPT_VERSION,
    assessmentId: assessment.id,
    answers: Array(assessment.questions.length),
    finished: false,
  };
}

function validAnswerId(question, answerId) {
  return answerId === NOT_ENCOUNTERED || question.options.some((option) => option.id === answerId);
}

export function normalizedAttempt(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== ATTEMPT_VERSION) return null;
  const assessment = assessmentFor(raw.assessmentId);
  if (!assessment || !Array.isArray(raw.answers)) return null;
  if (raw.answers.length !== assessment.questions.length || raw.finished !== true) return null;
  if (!raw.answers.every((answerId, index) => validAnswerId(assessment.questions[index], answerId))) return null;
  return {
    version: ATTEMPT_VERSION,
    assessmentId: assessment.id,
    answers: [...raw.answers],
    finished: true,
  };
}

function selectionsFor(assessment, answers) {
  return assessment.questions.map((question, index) => {
    const answerId = answers[index];
    const option = question.options.find((candidate) => candidate.id === answerId) ?? null;
    return {
      question,
      answerId,
      option,
      encountered: answerId !== NOT_ENCOUNTERED,
    };
  });
}

function baseResult(assessment, answers) {
  const selections = selectionsFor(assessment, answers);
  return {
    assessmentId: assessment.id,
    assessment,
    kind: assessment.kind,
    answers: [...answers],
    selections,
    validCount: selections.filter((selection) => selection.encountered).length,
    scoringVersion: SCORING_VERSION,
    resultVersion: RESULT_VERSION,
  };
}

function scoreEntry(assessment, answers) {
  const result = baseResult(assessment, answers);
  const keys = Object.keys(assessment.profiles);
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  const opportunities = Object.fromEntries(keys.map((key) => [key, 0]));

  for (const selection of result.selections) {
    if (!selection.encountered || !selection.option) continue;
    for (const option of selection.question.options) opportunities[option.value] += 1;
    counts[selection.option.value] += 1;
  }

  const rates = Object.fromEntries(keys.map((key) => [
    key,
    opportunities[key] ? counts[key] / opportunities[key] : 0,
  ]));
  const sameRate = (left, right) => (
    counts[left] * opportunities[right] === counts[right] * opportunities[left]
  );
  const ranked = keys
    .filter((key) => counts[key] >= 2 && opportunities[key] > 0)
    .sort((left, right) => (
      counts[right] * opportunities[left] - counts[left] * opportunities[right]
      || counts[right] - counts[left]
    ));

  let classification;
  if (result.validCount < assessment.minimumValid) {
    classification = { kind: 'insufficient', primaryKeys: [], secondaryKeys: [], focusKeys: [] };
  } else if (!ranked.length) {
    classification = { kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: [] };
  } else {
    const leaders = ranked.filter((key) => sameRate(key, ranked[0]));
    if (leaders.length === 1) {
      const remaining = ranked.filter((key) => key !== leaders[0]);
      const tiedSecond = remaining.length
        ? remaining.filter((key) => sameRate(key, remaining[0]))
        : [];
      const secondaryKeys = tiedSecond.length === 1 ? tiedSecond : [];
      classification = {
        kind: 'unique',
        primaryKeys: leaders,
        secondaryKeys,
        focusKeys: [...leaders, ...secondaryKeys],
      };
    } else if (leaders.length === 2) {
      classification = { kind: 'shared', primaryKeys: leaders, secondaryKeys: [], focusKeys: leaders };
    } else {
      classification = { kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: leaders };
    }
  }

  const routeKeys = classification.kind === 'shared'
    ? classification.primaryKeys
    : classification.kind === 'unique'
      ? classification.primaryKeys
      : [];
  const recommendedAssessmentIds = [...new Set(routeKeys
    .map((key) => assessment.profiles[key]?.nextAssessment)
    .filter(Boolean))].slice(0, 2);

  return { ...result, counts, opportunities, rates, ranked, classification, recommendedAssessmentIds };
}

function scoreMeanState(assessment, answers) {
  const result = baseResult(assessment, answers);
  const values = result.selections
    .filter((selection) => selection.encountered && selection.option)
    .map((selection) => selection.option.value);
  if (result.validCount < assessment.minimumValid) {
    return {
      ...result,
      average: null,
      classification: { kind: 'insufficient', primaryKeys: [], secondaryKeys: [], focusKeys: [] },
    };
  }
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const profileKey = average >= 2.25 ? 'map' : average >= 1.5 ? 'outline' : average >= 0.75 ? 'on_demand' : 'current';
  return {
    ...result,
    average,
    classification: { kind: 'unique', primaryKeys: [profileKey], secondaryKeys: [], focusKeys: [profileKey] },
  };
}

function scoreDominantPattern(assessment, answers) {
  const result = baseResult(assessment, answers);
  const keys = Object.keys(assessment.profiles);
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const selection of result.selections) {
    if (selection.encountered && selection.option) counts[selection.option.value] += 1;
  }
  const ranked = [...keys].sort((left, right) => counts[right] - counts[left]);
  if (result.validCount < assessment.minimumValid) {
    return {
      ...result,
      counts,
      ranked,
      classification: { kind: 'insufficient', primaryKeys: [], secondaryKeys: [], focusKeys: [] },
    };
  }

  const highest = counts[ranked[0]];
  const leaders = ranked.filter((key) => counts[key] === highest);
  let classification;
  if (highest < 3) {
    classification = { kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: leaders };
  } else if (leaders.length === 1) {
    const secondaryKeys = ranked.filter((key) => key !== leaders[0] && counts[key] >= 2);
    classification = {
      kind: 'unique',
      primaryKeys: leaders,
      secondaryKeys,
      focusKeys: [...leaders, ...secondaryKeys],
    };
  } else if (leaders.length === 2) {
    classification = { kind: 'shared', primaryKeys: leaders, secondaryKeys: [], focusKeys: leaders };
  } else {
    classification = { kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: leaders };
  }
  return { ...result, counts, ranked, classification };
}

export function scoreAssessment(input) {
  const attempt = normalizedAttempt(input);
  if (!attempt) return null;
  const assessment = assessmentFor(attempt.assessmentId);
  if (assessment.kind === 'entry_tendency') return scoreEntry(assessment, attempt.answers);
  if (assessment.kind === 'mean_state') return scoreMeanState(assessment, attempt.answers);
  if (assessment.kind === 'dominant_pattern') return scoreDominantPattern(assessment, attempt.answers);
  return null;
}

export function profilesFor(result) {
  if (!result) return [];
  const { classification, assessment } = result;
  const keys = classification.focusKeys.length
    ? classification.focusKeys
    : result.ranked?.slice(0, 3) ?? [];
  return keys.map((key) => assessment.profiles[key]).filter(Boolean);
}

function typeNamesFor(assessment, keys) {
  return keys
    .map((key) => assessment.profiles[key]?.typeName)
    .filter(Boolean);
}

export function entryTypeModel(result) {
  if (!result || result.assessment.kind !== 'entry_tendency') return null;
  const { assessment, classification } = result;
  if (classification.kind === 'insufficient') {
    return { kind: 'insufficient', groups: [], message: '這次先不套用類型' };
  }
  if (classification.kind === 'mixed') {
    const names = typeNamesFor(assessment, classification.focusKeys);
    return {
      kind: 'mixed',
      groups: names.length ? [{ label: '這次反覆出現的傾向', names }] : [],
      message: names.length ? '' : '這次沒有一個傾向明顯重複出現',
    };
  }
  if (classification.kind === 'shared') {
    return {
      kind: 'shared',
      groups: [{ label: '同樣常出現的傾向', names: typeNamesFor(assessment, classification.primaryKeys) }],
      message: '',
    };
  }
  const groups = [{
    label: '本次較常出現的傾向',
    names: typeNamesFor(assessment, classification.primaryKeys),
  }];
  const secondaryNames = typeNamesFor(assessment, classification.secondaryKeys);
  if (secondaryNames.length) groups.push({ label: '同時也出現', names: secondaryNames });
  return { kind: 'unique', groups, message: '' };
}

export function resultAnalysisModel(result) {
  if (!result) return null;
  const { assessment, classification } = result;
  const profiles = classification.kind === 'insufficient'
    ? []
    : profilesFor(result).map((profile) => ({
      key: profile.key ?? profile.code,
      name: profile.name,
      typeName: assessment.kind === 'entry_tendency' ? profile.typeName : '',
      action: assessment.kind === 'entry_tendency' ? profile.meaning : profile.action,
      help: profile.help,
      watch: profile.watch,
      narrative: assessment.kind === 'entry_tendency' ? '' : profile.path,
    }));
  let context;
  if (classification.kind === 'insufficient') {
    context = '有幾個情境你沒有遇過。這次先不勉強歸納，完成探索本身就已經留下可再回來看的起點。';
  } else if (classification.kind === 'shared') {
    context = '這次有兩個方向同樣常出現。它們可以同時存在，不需要選出哪一個才是真正的你。';
  } else if (classification.kind === 'mixed') {
    context = profiles.length
      ? '不同情境帶出了不同方向。先把它們並排放著，看見自己會隨情境調整就好。'
      : '這次的選擇分散在不同方向，沒有一個做法明顯重複出現。';
  } else {
    context = assessment.kind === 'entry_tendency'
      ? '這是本次生活選擇中較常出現的起點，不是固定不變的個性。情境改變時，你仍可能採取不同做法。'
      : '把這次較常出現的做法、它帶來的幫助，以及可能較晚被看見的部分放在一起看。';
  }
  return {
    kind: classification.kind,
    heading: resultHeading(result),
    summary: resultIntro(result),
    context,
    profiles,
  };
}

export function evidenceFor(result, profileKey = null, limit = 3) {
  if (!result) return [];
  if (result.assessment.kind === 'mean_state') {
    return result.selections
      .filter((selection) => selection.encountered && selection.option)
      .slice(0, limit)
      .map((selection) => ({
        situation: selection.question.title,
        response: selection.option.text,
        profileKey: String(selection.option.value),
      }));
  }
  const focusKeys = profileKey
    ? [profileKey]
    : result.classification.focusKeys.length
      ? result.classification.focusKeys
      : result.ranked?.slice(0, 2) ?? [];
  return result.selections
    .filter((selection) => selection.encountered && selection.option && focusKeys.includes(String(selection.option.value)))
    .slice(0, limit)
    .map((selection) => ({
      situation: selection.question.title,
      response: selection.option.text,
      profileKey: String(selection.option.value),
    }));
}

export function resultHeading(result) {
  if (!result) return '還沒有可整理的結果';
  const { classification, assessment } = result;
  if (classification.kind === 'insufficient') return '這次先不歸納單一方向';
  if (classification.kind === 'mixed') return '不同情境中，你選了不同做法';
  const names = classification.primaryKeys.map((key) => assessment.profiles[key]?.name).filter(Boolean);
  if (classification.kind === 'shared') return names.join('，也會');
  return names[0] ?? '這次的決策方向';
}

export function resultIntro(result) {
  if (!result) return '';
  const { classification, assessment } = result;
  if (classification.kind === 'insufficient') {
    return '有幾個情境你沒有遇過，這次先不急著替你歸納方向。你仍可以挑一個現在想了解的主題繼續。';
  }
  if (classification.kind === 'mixed') {
    return '不同情境帶出了不同考量，這不代表前後矛盾。你可能會依金額、關係與當下壓力，改變先處理的事情。';
  }
  if (assessment.kind === 'entry_tendency') {
    const primary = assessment.profiles[classification.primaryKeys[0]];
    const secondaryNames = classification.secondaryKeys
      .map((key) => assessment.profiles[key]?.name)
      .filter(Boolean);
    const decisionPhrase = primary.name.startsWith('重視')
      ? `先顧到${primary.name.slice(2)}`
      : primary.name.startsWith('願意')
        ? primary.name
        : primary.name;
    const base = `這次作答中，你在幾個生活選擇裡較常${decisionPhrase}。`;
    return secondaryNames.length ? `${base} 同時也出現「${secondaryNames.join('、')}」的考量。` : base;
  }
  if (classification.kind === 'shared') return '這次回答裡，兩種決定方向同樣常出現。你可以先選一個現在最想理解的部分。';
  const profile = assessment.profiles[classification.primaryKeys[0]];
  return profile
    ? `這次回答中，較常出現「${profile.name}」的做法。下面把它帶來的幫助與可以留意的地方放在一起看。`
    : '';
}

export function recommendationFor(result, profileKey = null) {
  if (!result || result.assessment.kind === 'entry_tendency') return null;
  if (result.classification.kind === 'insufficient') return null;
  const key = profileKey
    ?? result.classification.primaryKeys[0]
    ?? result.classification.focusKeys[0]
    ?? null;
  const profile = key ? result.assessment.profiles[key] : null;
  if (!profile) {
    const fallback = TOOLS[result.assessment.fallbackTool];
    return fallback ? { profileKey: null, profile: null, primary: fallback, others: [] } : null;
  }
  return {
    profileKey: key,
    profile,
    primary: TOOLS[profile.primaryTool],
    others: profile.otherTools.map((toolKey) => TOOLS[toolKey]).filter(Boolean).slice(0, 2),
    toolRouteVersion: TOOL_ROUTE_VERSION,
  };
}

export function otherAssessments(currentId) {
  return ASSESSMENT_ORDER
    .filter((id) => id !== 'entry' && id !== currentId)
    .map((id) => ASSESSMENTS[id]);
}
