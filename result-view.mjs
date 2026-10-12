import { ASSESSMENTS, ASSESSMENT_ORDER } from './data.mjs';
import {
  entryTypeModel,
  evidenceFor,
  profilesFor,
  recommendationFor,
  resultAnalysisModel,
  resultHeading,
  resultIntro,
} from './scoring.mjs';
import {
  combinedAnalysisModel,
  completionToolRecommendations,
  completedCount,
  resultFromSnapshot,
  resultSummary,
} from './progress.mjs';

const TOPIC_ICONS = {
  entry: '◇',
  clarity: '◎',
  pressure: '∿',
  family: '↔',
  plan: '✓',
};

const DECISION_MAP_LABELS = {
  entry: '做決定時先在意',
  clarity: '財務資訊',
  pressure: '壓力反應',
  family: '家人金錢界線',
  plan: '計畫行動',
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function linkButton(text, href, variant = 'button-primary') {
  const link = element('a', `button ${variant}`);
  link.href = href;
  link.append(text, element('span', '', ' →'));
  return link;
}

function assessmentUrl(id) {
  return `./assessment.html?assessment=${encodeURIComponent(id)}`;
}

function resultUrl(id) {
  return `./result.html?assessment=${encodeURIComponent(id)}`;
}

function evidenceItems(result, profileKey = null) {
  if (!result?.selections) return [];
  return evidenceFor(result, profileKey, 3);
}

function evidenceList(result, profileKey = null) {
  const evidence = evidenceItems(result, profileKey);
  if (!evidence.length) return null;
  const list = element('div', 'evidence-list');
  evidence.forEach((item) => {
    const card = element('article', 'evidence-card');
    card.append(
      element('span', 'evidence-label', item.situation),
      element('p', '', item.response),
    );
    list.append(card);
  });
  return list;
}

function renderAnalysisNode(label, text, tone = '') {
  const node = element('div', `analysis-node${tone ? ` analysis-node-${tone}` : ''}`);
  node.append(element('span', 'analysis-node-label', label), element('p', '', text));
  return node;
}

function renderAnalysisConnector() {
  const connector = element('span', 'analysis-connector');
  connector.setAttribute('aria-hidden', 'true');
  return connector;
}

function renderProfileAnalysis(profile, index, count) {
  const article = element('article', 'analysis-branch');
  const branchLabel = profile.typeName
    ? `${count > 1 ? `方向 ${index + 1}｜` : ''}${profile.typeName}`
    : count > 1 ? `方向 ${index + 1}` : '';
  if (branchLabel) article.append(element('span', 'analysis-branch-label', branchLabel));
  article.append(element('h3', '', profile.name));
  const path = element('div', 'analysis-path');
  path.append(
    renderAnalysisNode('這次較常先顧到', profile.action, 'action'),
    renderAnalysisConnector(),
    renderAnalysisNode('這樣做在幫你', profile.help, 'help'),
    renderAnalysisConnector(),
    renderAnalysisNode('也可以替自己留意', profile.watch, 'watch'),
  );
  article.append(path);
  if (profile.narrative) {
    const narrative = element('div', 'analysis-narrative');
    narrative.append(element('h4', '', '放回生活裡看'), element('p', '', profile.narrative));
    article.append(narrative);
  }
  return article;
}

function renderOpenAnalysis(kind) {
  const path = element('div', 'analysis-path analysis-path-open');
  if (kind === 'insufficient') {
    path.append(
      renderAnalysisNode('探索已完成', '你已看過這個主題的生活情境。', 'action'),
      renderAnalysisConnector(),
      renderAnalysisNode('可整理的情境較少', '有些狀況你沒有遇過，這很正常。', 'help'),
      renderAnalysisConnector(),
      renderAnalysisNode('先不勉強歸納', '等生活經驗不同時，再回來看看也可以。', 'watch'),
    );
  } else {
    path.append(
      renderAnalysisNode('不同情境', '每個生活選擇帶出的條件不太一樣。', 'action'),
      renderAnalysisConnector(),
      renderAnalysisNode('不同考量', '你會依金額、關係或壓力調整做法。', 'help'),
      renderAnalysisConnector(),
      renderAnalysisNode('先保留彈性', '這次不需要把自己固定成單一方向。', 'watch'),
    );
  }
  return path;
}

function appendAnalysisContent(container, result, { includeEvidence = false } = {}) {
  const model = resultAnalysisModel(result);
  container.append(element('p', 'support-copy', model.context));
  if (model.profiles.length) {
    const branches = element('div', 'analysis-branches');
    model.profiles.forEach((profile, index) => {
      branches.append(renderProfileAnalysis(profile, index, model.profiles.length));
    });
    container.append(branches);
  } else {
    container.append(renderOpenAnalysis(model.kind));
  }

  if (includeEvidence) {
    const evidence = evidenceList(result);
    if (evidence) {
      container.append(element('h3', 'insight-subheading', '哪些選擇帶出這個結果'), evidence);
    }
  }
}

function renderResultAnalysis(result, { includeEvidence = false } = {}) {
  const section = element('section', 'result-section analysis-section');
  section.append(element('h2', '', '結果摘要與分析'));
  appendAnalysisContent(section, result, { includeEvidence });
  return section;
}

function renderEntrySummary(result) {
  return renderResultAnalysis(result, { includeEvidence: true });
}

function renderEntryTypes(result) {
  const model = entryTypeModel(result);
  const summary = element('div', `entry-type-summary entry-type-summary-${model.kind}`);
  if (model.groups.length) {
    model.groups.forEach((group, index) => {
      const item = element('div', `entry-type-item${index ? ' entry-type-item-secondary' : ''}`);
      item.append(
        element('span', '', group.label),
        element('strong', '', group.names.join('、')),
      );
      summary.append(item);
    });
  } else {
    const item = element('div', 'entry-type-item entry-type-item-open');
    item.append(element('span', '', '類型整理'), element('strong', '', model.message));
    summary.append(item);
  }
  return summary;
}

function renderEntryOverview(result) {
  const section = element('section', 'result-section overview-entry-result');
  section.id = 'entry-result';
  const heading = element('div', 'overview-entry-heading');
  heading.append(
    element('p', 'section-kicker', '入口探索結果'),
    renderEntryTypes(result),
    element('h2', '', resultHeading(result)),
    element('p', 'lead', resultIntro(result)),
  );
  const analysis = element('div', 'overview-entry-analysis');
  analysis.append(element('h3', '', '結果摘要與分析'));
  appendAnalysisContent(analysis, result);
  const actions = element('div', 'overview-entry-actions');
  actions.append(linkButton('重新測驗入口探索', assessmentUrl('entry'), 'button-secondary'));
  section.append(heading, analysis, actions);
  return section;
}

function recommendationQuestion(progress, assessmentId) {
  const entry = progress?.results?.entry;
  const primaryKey = entry?.classification?.primaryKeys?.[0];
  const profile = primaryKey ? ASSESSMENTS.entry.profiles[primaryKey] : null;
  return profile?.nextAssessment === assessmentId ? profile.followupQuestion : '';
}

function explorationCard(assessment, progress, { recommended = false } = {}) {
  const snapshot = progress?.results?.[assessment.id] ?? null;
  const completed = Boolean(snapshot);
  const classes = [
    'exploration-card',
    assessment.id === 'entry' ? 'exploration-card-entry' : '',
    completed ? 'exploration-card-complete' : '',
    recommended && !completed ? 'exploration-card-recommended' : '',
  ].filter(Boolean).join(' ');
  const card = element('article', classes);
  const top = element('div', 'exploration-card-top');
  const identity = element('div', 'exploration-card-identity');
  identity.append(
    element('span', 'topic-icon', TOPIC_ICONS[assessment.id] ?? '•'),
    element('span', 'topic-duration', `${assessment.questions.length} 題 · ${assessment.duration}`),
  );
  const status = element('span', `exploration-status${completed ? ' is-complete' : ''}`, completed ? '已完成' : '尚未完成');
  top.append(identity, status);
  card.append(top, element('h3', '', assessment.title), element('p', 'exploration-description', assessment.description));

  if (recommended && !completed) {
    card.append(element('p', 'recommendation-label', '依入口結果，建議先看'));
    const question = recommendationQuestion(progress, assessment.id);
    if (question) card.append(element('p', 'recommendation-question', question));
  }

  const actions = element('div', 'exploration-actions');
  if (completed) {
    const summary = resultSummary(snapshot);
    if (summary) {
      const result = element('div', 'exploration-result');
      result.append(element('span', '', '這項結果'), element('strong', '', summary.heading));
      card.append(result);
    }
    if (assessment.id !== 'entry') {
      actions.append(linkButton('查看摘要與分析', resultUrl(assessment.id), 'button-primary'));
    }
    actions.append(linkButton('重新測驗', assessmentUrl(assessment.id), 'button-quiet'));
  } else {
    actions.append(linkButton(assessment.id === 'entry' ? '開始入口探索' : '開始 6 題探索', assessmentUrl(assessment.id), recommended ? 'button-primary' : 'button-secondary'));
  }
  card.append(actions);
  return card;
}

function renderExplorationProgress(progress) {
  const count = completedCount(progress);
  const entryComplete = Boolean(progress?.results?.entry);
  const recommendations = new Set(progress?.results?.entry?.recommendedAssessmentIds ?? []);
  const section = element('section', 'result-section exploration-progress');
  const header = element('div', 'exploration-progress-header');
  const copy = element('div');
  copy.append(
    element('p', 'section-kicker', entryComplete ? '接下來的探索' : '探索進度'),
    element('h2', '', entryComplete ? '四個延伸主題' : '先完成入口探索'),
    element('p', 'support-copy', entryComplete
      ? count === ASSESSMENT_ORDER.length
        ? '入口結果已整理在上方；四個延伸主題也都完成了，可回看各自的摘要與分析。'
        : '入口結果已整理在上方。接著可選一個想看的主題，順序由你決定。'
      : '入口探索會先整理做金錢決定時較常在意的事，再帶你看四個延伸主題。'),
  );
  const meter = element('div', 'exploration-meter');
  meter.setAttribute('role', 'progressbar');
  meter.setAttribute('aria-label', '探索完成進度');
  meter.setAttribute('aria-valuemin', '0');
  meter.setAttribute('aria-valuemax', String(ASSESSMENT_ORDER.length));
  meter.setAttribute('aria-valuenow', String(count));
  meter.append(element('strong', '', `已完成 ${count}／${ASSESSMENT_ORDER.length} 項探索`));
  const segments = element('span', 'exploration-meter-segments');
  ASSESSMENT_ORDER.forEach((id) => segments.append(element('i', progress?.results?.[id] ? 'is-complete' : '')));
  meter.append(segments);
  header.append(copy, meter);
  section.append(header);

  const grid = element('div', 'exploration-grid');
  ASSESSMENT_ORDER.forEach((id) => {
    if (id === 'entry' && entryComplete) return;
    grid.append(explorationCard(ASSESSMENTS[id], progress, {
      recommended: recommendations.has(id),
    }));
  });
  section.append(grid);
  return section;
}

function decisionMapNode(item) {
  const className = `decision-map-node decision-map-node-${item.id}`;
  const node = item.id === 'entry' ? element('article', className) : element('a', className);
  if (item.id !== 'entry') {
    node.href = resultUrl(item.id);
    node.setAttribute('aria-label', `${DECISION_MAP_LABELS[item.id]}：${item.heading}，查看摘要與分析`);
  }
  node.append(
    element('span', 'decision-map-icon', TOPIC_ICONS[item.id]),
    element('span', 'decision-map-topic', DECISION_MAP_LABELS[item.id]),
    element('strong', '', item.heading),
  );
  return node;
}

function renderCompletionSynthesis(progress) {
  const model = combinedAnalysisModel(progress);
  if (!model) return null;
  const recommendations = completionToolRecommendations(progress);
  const section = element('section', 'result-section completion-synthesis');
  const celebration = element('div', 'completion-heading');
  const mark = element('div', 'completion-mark');
  mark.setAttribute('aria-hidden', 'true');
  mark.append(element('strong', '', '✓'));
  for (let index = 0; index < 5; index += 1) mark.append(element('i'));
  const copy = element('div');
  copy.append(
    element('p', 'section-kicker', '五項探索完成'),
    element('h2', '', '恭喜你完成 5 項探索'),
    element('p', 'support-copy', '你已從做決定的起點、財務資訊、壓力、關係與行動，整理出目前的五個角度。'),
  );
  celebration.append(mark, copy);
  section.append(celebration);

  const visualHeading = element('h3', 'completion-subheading', '我的財務決策地圖');
  const map = element('div', 'decision-map');
  map.setAttribute('aria-label', '我的財務決策地圖：五個已完成主題的描述性結果');
  model.items.forEach((item) => map.append(decisionMapNode(item)));
  section.append(
    visualHeading,
    map,
    element('p', 'decision-map-note', '這五個角度沒有高低，也不會合成總分。地圖可回看各主題；下方會把五項放進同一個決策脈絡裡整理。'),
  );

  const analysis = element('div', 'combined-analysis');
  analysis.append(
    element('p', 'section-kicker', '五項綜合整理'),
    element('h3', '', '我的綜合評估摘要'),
    element('p', 'synthesis-lead', model.synthesis.overview),
  );
  const connections = element('div', 'synthesis-connection-grid');
  model.synthesis.connections.forEach((connection, index) => {
    const card = element('article', 'synthesis-connection-card');
    card.append(
      element('span', 'synthesis-index', `0${index + 1}`),
      element('h4', '', connection.label),
      element('p', '', connection.text),
    );
    connections.append(card);
  });
  const balance = element('div', 'synthesis-balance-grid');
  const strength = element('article', 'synthesis-balance-card synthesis-balance-card-strength');
  strength.append(
    element('span', 'synthesis-card-icon', '＋'),
    element('h4', '', '可以繼續保留的做法'),
    element('p', '', model.synthesis.strength),
  );
  const watch = element('article', 'synthesis-balance-card synthesis-balance-card-watch');
  watch.append(
    element('span', 'synthesis-card-icon', '◌'),
    element('h4', '', '值得替自己多留一點空間'),
    element('p', '', model.synthesis.watch),
  );
  balance.append(strength, watch);
  const nextStep = element('div', 'synthesis-next-step');
  nextStep.append(
    element('span', 'step-time', '先做一小步'),
    element('h4', '', '接下來可以先做'),
    element('p', '', model.synthesis.nextStep),
  );
  analysis.append(
    connections,
    balance,
    nextStep,
    element('p', 'combined-boundary', '這份整理沒有高低，也不把你固定成某一種人；它不是心理或財務診斷，生活情況改變時，做法也可能跟著改變。'),
  );
  section.append(analysis);

  if (recommendations.items.length) {
    const toolsSection = element('div', 'completion-tools');
    const copy = recommendations.mode === 'general'
      ? '有些主題這次沒有勉強歸納，先整理三項可自行使用的工具。從現在最想處理的一項開始就好。'
      : recommendations.mode === 'mixed'
        ? '依照這次可整理的結果，再補上一項通用起點。先選現在最想處理的一項就好。'
        : '依照五項探索裡較常出現的考量，整理出三項可以接著試試看的工具。先選現在最想處理的一項就好。';
    toolsSection.append(
      element('h3', '', '嘗試使用以下工具'),
      element('p', 'support-copy', copy),
    );
    const grid = element('div', 'tool-grid completion-tool-grid');
    recommendations.items.forEach((item, index) => {
      grid.append(toolCard(
        item.tool,
        index === 0,
        item.basis === 'fallback' ? '通用整理起點' : `接續：${DECISION_MAP_LABELS[item.assessmentId]}`,
      ));
    });
    toolsSection.append(
      grid,
      element('p', 'privacy-note completion-tool-note', '工具會另開頁面；這次作答不會自動帶入。'),
    );
    section.append(toolsSection);
  }
  return section;
}

function toolCard(tool, primary = false, context = '') {
  const card = element('article', `tool-card${primary ? ' tool-card-primary' : ''}`);
  if (primary) card.append(element('span', 'tool-label', '可以先從這項開始'));
  if (context) card.append(element('span', 'tool-context', context));
  card.append(element('h3', '', tool.name), element('p', '', tool.description));
  const link = linkButton(tool.action, tool.href, primary ? 'button-primary' : 'button-secondary');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  card.append(link);
  return card;
}

function renderFocus(result, profileKey) {
  const recommendation = recommendationFor(result, profileKey);
  const fragment = document.createDocumentFragment();
  if (!recommendation?.profile) return fragment;
  const { profile } = recommendation;

  const step = element('section', 'result-section small-step-section');
  const stepHeading = element('h2', '', '如果想繼續，可以先做這一步');
  stepHeading.tabIndex = -1;
  step.append(
    element('span', 'step-time', '約 10 分鐘'),
    stepHeading,
    element('p', 'step-action', profile.step),
    element('p', 'support-copy', '先替自己整理就好，不用一次完成，也不必交給任何人。'),
  );
  fragment.append(step);

  const details = element('details', 'tool-disclosure');
  details.open = true;
  details.append(element('summary', '', '用剛剛整理的內容繼續'));
  const inside = element('div', 'tool-disclosure-inner');
  inside.append(
    element('p', 'tool-bridge', profile.bridge),
    element('p', 'privacy-note', '工具會另開頁面；這次的選項不會自動帶入。'),
  );
  const tools = element('div', 'tool-grid');
  tools.append(toolCard(recommendation.primary, true));
  recommendation.others.forEach((tool) => tools.append(toolCard(tool)));
  inside.append(tools);
  details.append(inside);
  fragment.append(details);
  return fragment;
}

function renderExtensionBody(result) {
  const wrapper = element('div', 'extension-result-body');
  wrapper.append(renderResultAnalysis(result, { includeEvidence: true }));
  if (result.classification.kind === 'insufficient') {
    return wrapper;
  }

  const profiles = profilesFor(result);
  const needsChoice = profiles.length > 1
    && (result.classification.kind === 'shared' || result.classification.kind === 'mixed');
  const focusRoot = element('div', 'focus-result');
  if (needsChoice) {
    const chooser = element('section', 'result-section focus-chooser');
    chooser.append(
      element('p', 'section-kicker', '接著選一個方向'),
      element('h2', '', '你想先從哪個方向開始？'),
      element('p', 'support-copy', '上面的結果會完整保留；這個選擇只會決定接下來顯示的小步驟與工具。'),
    );
    const buttons = element('div', 'focus-options');
    profiles.forEach((profile) => {
      const button = element('button', 'focus-button', profile.name);
      button.type = 'button';
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        buttons.querySelectorAll('button').forEach((candidate) => candidate.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        focusRoot.replaceChildren(renderFocus(result, profile.code));
        focusRoot.querySelector('h2')?.focus({ preventScroll: true });
      });
      buttons.append(button);
    });
    chooser.append(buttons);
    wrapper.append(chooser, focusRoot);
  } else {
    const profileKey = result.classification.primaryKeys[0];
    focusRoot.append(renderFocus(result, profileKey));
    wrapper.append(focusRoot);
  }
  return wrapper;
}

function renderResultHero(result) {
  const hero = element('section', 'result-hero');
  const copy = element('div', 'result-hero-copy');
  copy.append(
    element('span', 'eyebrow', result.assessment.kind === 'entry_tendency' ? '入口探索結果' : result.assessment.title),
    element('p', 'result-label', '結果摘要'),
  );
  if (result.assessment.kind === 'entry_tendency') copy.append(renderEntryTypes(result));
  copy.append(element('h1', '', resultHeading(result)), element('p', 'lead', resultIntro(result)));
  const visual = element('div', 'result-orbit');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(element('span', 'orbit-core', '你'), element('i'), element('i'), element('i'));
  hero.append(copy, visual);
  return hero;
}

function renderBottomActions(result) {
  const section = element('section', 'result-actions');
  section.append(
    linkButton('回到我的財務決策總覽', './result.html?view=overview', 'button-primary'),
    linkButton('重新測驗這個主題', assessmentUrl(result.assessmentId), 'button-quiet'),
  );
  return section;
}

export function renderMissingResult(root, progress = null, requestedId = null) {
  const requested = requestedId ? ASSESSMENTS[requestedId] : null;
  const section = element('section', 'empty-result');
  section.append(
    element('span', 'eyebrow', '還沒有探索結果'),
    element('h1', '', requested ? '這個分頁還沒有這項結果' : '先從一個生活情境開始'),
    element('p', 'lead', requested
      ? requested.id === 'entry'
        ? `完成「${requested.title}」後會直接看到結果；財務決策總覽會保留重新測驗。`
        : `完成「${requested.title}」後，就能從財務決策總覽回看摘要與分析。`
      : '完成入口探索後，這裡會整理你做金錢決定時較常先顧到的事。'),
    linkButton(requested ? '開始這項探索' : '開始入口探索', assessmentUrl(requested?.id ?? 'entry')),
  );
  root.replaceChildren(section);
}

export function renderProgressOverview(root, progress, currentEntryResult = null) {
  const storedEntry = progress?.results?.entry
    ? resultFromSnapshot(progress.results.entry)
    : null;
  const entryResult = currentEntryResult?.assessmentId === 'entry'
    ? currentEntryResult
    : storedEntry;
  const hero = element('section', 'overview-hero');
  hero.append(
    element('span', 'eyebrow', '探索總覽'),
    element('h1', '', '我的財務決策總覽'),
    element('p', 'lead', entryResult
      ? '入口探索的整理與四個延伸主題都在這一頁。每個主題各自描述，不會合成總分。'
      : '先完成入口探索，再依自己的需要選擇四個延伸主題。'),
  );
  const completion = renderCompletionSynthesis(progress);
  root.replaceChildren(hero);
  if (completion) root.append(completion);
  if (entryResult) root.append(renderEntryOverview(entryResult));
  root.append(renderExplorationProgress(progress));
  const actions = element('section', 'result-actions');
  actions.append(linkButton('回到檢測說明', './index.html', 'button-quiet'));
  root.append(actions);
}

export function renderResult(root, result) {
  root.replaceChildren(renderResultHero(result));
  if (result.assessment.kind === 'entry_tendency') {
    root.append(renderEntrySummary(result));
  } else {
    root.append(renderExtensionBody(result));
    if (result.assessment.safetyNote) {
      const note = element('aside', 'safety-note');
      note.append(element('strong', '', '由你決定要不要分享'), element('p', '', result.assessment.safetyNote));
      root.append(note);
    }
  }
  root.append(renderBottomActions(result));
}
