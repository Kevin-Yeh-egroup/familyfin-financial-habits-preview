import {
  ASSESSMENTS,
  NOT_ENCOUNTERED,
  STORAGE_KEY,
} from './data.mjs';
import {
  assessmentFor,
  emptyAttempt,
  normalizedAttempt,
  scoreAssessment,
} from './scoring.mjs';
import {
  completedCount,
  emptyProgress,
  normalizedProgress,
  progressWithResult,
  PROGRESS_KEY,
  resultFromSnapshot,
} from './progress.mjs';
import {
  renderMissingResult,
  renderProgressOverview,
  renderResult,
} from './result-view.mjs';

const $ = (selector) => document.querySelector(selector);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clearTransfer() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // The assessment still works until result handoff if storage is unavailable.
  }
}

function storeTransfer(attempt) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
    return true;
  } catch {
    return false;
  }
}

function consumeTransfer() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return raw ? normalizedAttempt(JSON.parse(raw)) : null;
  } catch {
    clearTransfer();
    return null;
  }
}

function readProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    return raw ? normalizedProgress(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

function writeProgress(progress) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(normalizedProgress(progress)));
    return true;
  } catch {
    return false;
  }
}

function requestedAssessment() {
  const id = new URLSearchParams(window.location.search).get('assessment') ?? 'entry';
  return assessmentFor(id) ?? ASSESSMENTS.entry;
}

function initializeLanding() {
  clearTransfer();
  const progress = readProgress();
  if (!completedCount(progress)) return;
  const cta = $('.cta-row');
  if (!cta) return;
  const link = element('a', 'button button-secondary', '查看我的探索總覽 →');
  link.href = './result.html?view=overview';
  cta.append(link);
}

function initializeAssessment() {
  clearTransfer();
  const assessment = requestedAssessment();
  const attempt = emptyAttempt(assessment.id);
  let current = 0;
  let advanceTimer = null;
  let pointerSelection = false;
  const panel = $('#question-panel');
  const message = $('#question-message');
  const next = $('#next');
  const previous = $('#previous');

  document.title = `${assessment.title}｜好理家在`;
  $('#assessment-name').textContent = assessment.title;
  $('#assessment-kind').textContent = assessment.eyebrow;

  function cancelScheduledAdvance() {
    if (advanceTimer !== null) window.clearTimeout(advanceTimer);
    advanceTimer = null;
  }

  function finish() {
    cancelScheduledAdvance();
    attempt.finished = true;
    if (!storeTransfer(attempt)) {
      message.textContent = '目前無法開啟結果，請稍後再試一次。';
      return;
    }
    window.location.href = './result.html';
  }

  function focusQuestion() {
    const heading = $('#question-title');
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const rect = panel.getBoundingClientRect();
    if (rect.top < 0 || rect.top > window.innerHeight * 0.45) {
      panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  function advance() {
    if (attempt.answers[current] === undefined) {
      message.textContent = '請先選一個答案。';
      next.disabled = true;
      return;
    }
    if (current === assessment.questions.length - 1) {
      finish();
      return;
    }
    current += 1;
    render();
    focusQuestion();
  }

  function scheduleAdvance(origin, fieldset) {
    cancelScheduledAdvance();
    fieldset.disabled = true;
    advanceTimer = window.setTimeout(() => {
      advanceTimer = null;
      if (current === origin) advance();
    }, 380);
  }

  function updateProgress() {
    const position = current + 1;
    const total = assessment.questions.length;
    const progress = $('#progress');
    progress.value = position;
    progress.max = total;
    progress.textContent = `${position}／${total}`;
    progress.setAttribute('aria-label', `目前第 ${position}／${total} 題`);
    $('#progress-text').textContent = `第 ${position}／${total} 題`;
    $('#progress-percent').textContent = `${Math.round(position / total * 100)}%`;
  }

  function answerOption(option, checkedId, fieldset) {
    const label = element('label', `answer-option${option.id === NOT_ENCOUNTERED ? ' answer-option-skip' : ''}`);
    const input = element('input');
    input.type = 'radio';
    input.name = 'current-answer';
    input.autocomplete = 'off';
    input.value = option.id;
    input.checked = option.id === checkedId;
    label.addEventListener('pointerdown', () => { pointerSelection = true; });
    label.addEventListener('pointercancel', () => { pointerSelection = false; });
    input.addEventListener('change', () => {
      attempt.answers[current] = option.id;
      message.textContent = '';
      next.disabled = false;
      if (pointerSelection) scheduleAdvance(current, fieldset);
      pointerSelection = false;
    });
    label.append(input, element('span', 'answer-copy', option.text));
    return label;
  }

  function renderOptions(question) {
    const fieldset = element('fieldset', 'answer-set');
    const legend = element('legend', '', question.prompt);
    fieldset.append(legend);
    const checkedId = attempt.answers[current];
    question.options.forEach((option) => fieldset.append(answerOption(option, checkedId, fieldset)));
    fieldset.append(answerOption({
      id: NOT_ENCOUNTERED,
      text: '我沒有遇過這個狀況',
    }, checkedId, fieldset));
    return fieldset;
  }

  function render() {
    cancelScheduledAdvance();
    pointerSelection = false;
    updateProgress();
    panel.replaceChildren();
    message.textContent = '';
    previous.disabled = current === 0;

    const question = assessment.questions[current];
    const heading = element('h1', 'scenario-title', question.scenario);
    heading.id = 'question-title';
    heading.tabIndex = -1;
    panel.append(
      element('p', 'question-kicker', '想像如果是你來處理'),
      heading,
      renderOptions(question),
    );
    next.disabled = attempt.answers[current] === undefined;
    next.textContent = current === assessment.questions.length - 1 ? '查看整理 →' : '下一題 →';
  }

  previous.addEventListener('click', () => {
    cancelScheduledAdvance();
    if (current > 0) current -= 1;
    render();
    focusQuestion();
  });
  next.addEventListener('click', () => {
    cancelScheduledAdvance();
    advance();
  });
  render();
}

function initializeResult() {
  const root = $('#result-root');
  const attempt = consumeTransfer();
  const result = attempt ? scoreAssessment(attempt) : null;
  let progress = readProgress();
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('assessment');
  const wantsOverview = params.get('view') === 'overview';
  const backLink = $('#result-back-link');

  function showOverview(currentEntryResult = null, canonicalize = false) {
    if (canonicalize) window.history.replaceState(null, '', './result.html?view=overview');
    if (backLink) {
      backLink.href = './index.html';
      backLink.textContent = '← 回到檢測說明';
    }
    document.title = '我的財務決策總覽｜好理家在';
    renderProgressOverview(root, progress, currentEntryResult);
  }

  if (result) {
    progress = progressWithResult(progress, result);
    writeProgress(progress);
    if (result.assessmentId === 'entry') {
      showOverview(result, true);
      return;
    }
    window.history.replaceState(null, '', `./result.html?assessment=${encodeURIComponent(result.assessmentId)}`);
    if (backLink) {
      backLink.href = './result.html?view=overview';
      backLink.textContent = '← 回到我的財務決策總覽';
    }
    document.title = `${result.assessment.title}｜結果｜好理家在`;
    renderResult(root, result);
    return;
  }

  if (wantsOverview || (!requestedId && completedCount(progress))) {
    showOverview();
    return;
  }

  const snapshot = requestedId ? progress.results[requestedId] : null;
  if (requestedId === 'entry' && snapshot) {
    showOverview(null, true);
    return;
  }
  const restored = snapshot ? resultFromSnapshot(snapshot) : null;
  if (restored) {
    if (backLink) {
      backLink.href = './result.html?view=overview';
      backLink.textContent = '← 回到我的財務決策總覽';
    }
    document.title = `${restored.assessment.title}｜結果摘要｜好理家在`;
    renderResult(root, restored);
    return;
  }

  renderMissingResult(root, progress, requestedId);
}

const page = document.body.dataset.page;
if (page === 'landing') initializeLanding();
if (page === 'assessment') initializeAssessment();
if (page === 'result') initializeResult();

window.addEventListener('pageshow', (event) => {
  if (event.persisted && (page === 'assessment' || page === 'result')) window.location.reload();
});
