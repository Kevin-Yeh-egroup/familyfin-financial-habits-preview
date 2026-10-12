import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import { ASSESSMENTS, ATTEMPT_VERSION, STORAGE_KEY } from '../data.mjs';
import { emptyProgress, progressWithResult, PROGRESS_KEY } from '../progress.mjs';
import { scoreAssessment } from '../scoring.mjs';

const BASE_URL = process.env.FAMILYFIN_SMOKE_URL || 'http://127.0.0.1:8766';
const CHROME_PATH = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MOBILE_ARTIFACT = fileURLToPath(new URL('./artifacts/local-integrated-overview-mobile-v11-7.png', import.meta.url));
const COMPLETE_ARTIFACT = fileURLToPath(new URL('./artifacts/local-complete-analysis-mobile-v11-7.png', import.meta.url));
const COMPLETE_DESKTOP_ARTIFACT = fileURLToPath(new URL('./artifacts/local-complete-analysis-desktop-v11-7.png', import.meta.url));
const EXTENSION_ARTIFACT = fileURLToPath(new URL('./artifacts/local-extension-result-mobile-v11-7.png', import.meta.url));
const DESKTOP_ARTIFACT = fileURLToPath(new URL('./artifacts/local-integrated-overview-desktop-v11-7.png', import.meta.url));
const wait = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function freePort() {
  return new Promise((resolvePort, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolvePort(port));
    });
  });
}

async function waitForTargets(port) {
  const url = `http://127.0.0.1:${port}/json/list`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url);
      const targets = await response.json();
      const page = targets.find(({ type }) => type === 'page');
      if (page?.webSocketDebuggerUrl) return page;
    } catch {
      // Chrome may still be starting.
    }
    await wait(100);
  }
  throw new Error('Chrome DevTools target did not become available');
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.errors = [];
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const callback = this.pending.get(message.id);
        if (!callback) return;
        this.pending.delete(message.id);
        if (message.error) callback.reject(new Error(message.error.message));
        else callback.resolve(message.result);
        return;
      }
      if (message.method === 'Runtime.exceptionThrown') {
        this.errors.push(message.params.exceptionDetails?.text || 'Runtime exception');
      }
      if (message.method === 'Log.entryAdded' && message.params.entry?.level === 'error') {
        this.errors.push(message.params.entry.text);
      }
    });
    await new Promise((resolveOpen, reject) => {
      this.socket.addEventListener('open', resolveOpen, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolveCommand, reject) => {
      this.pending.set(id, { resolve: resolveCommand, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result?.value;
  }
}

async function waitForPage(client, suffix) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const page = await client.evaluate(`({ path: location.pathname, ready: document.readyState })`);
      if (page?.path.endsWith(suffix) && page.ready === 'complete') return;
    } catch {
      // Navigation replaces the execution context.
    }
    await wait(100);
  }
  throw new Error(`Page did not reach ${suffix}`);
}

async function waitForCondition(client, expression, message) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await client.evaluate(expression)) return;
    await wait(100);
  }
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function capturePage(client, path) {
  const metrics = await client.send('Page.getLayoutMetrics');
  const { width, height } = metrics.cssContentSize;
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(screenshot.data, 'base64'));
}

function optionIds(assessmentId, values) {
  return values.map((value, index) => {
    const option = ASSESSMENTS[assessmentId].questions[index].options
      .find((candidate) => candidate.value === value);
    if (!option) throw new Error(`Missing ${value} in ${assessmentId} question ${index + 1}`);
    return option.id;
  });
}

function resultFor(assessmentId, values) {
  return scoreAssessment({
    version: ATTEMPT_VERSION,
    assessmentId,
    answers: optionIds(assessmentId, values),
    finished: true,
  });
}

function completeProgressFixture() {
  let progress = emptyProgress();
  [
    resultFor('entry', ['security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security']),
    resultFor('clarity', [3, 3, 3, 2, 2, 2]),
    resultFor('pressure', ['P1', 'P1', 'P1', 'P1', 'P2', 'P2']),
    resultFor('family', ['F2', 'F2', 'F2', 'F2', 'F1', 'F1']),
    resultFor('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']),
  ].forEach((result) => { progress = progressWithResult(progress, result); });
  return progress;
}

async function closeOwnedChrome(chrome, client) {
  if (process.platform === 'win32' && chrome.pid && chrome.exitCode === null) {
    const killer = spawn('taskkill', ['/PID', String(chrome.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    await Promise.race([
      new Promise((resolveExit) => killer.once('exit', resolveExit)),
      wait(3000),
    ]);
  } else if (client) {
    try { await client.send('Browser.close'); } catch { /* browser may already be closed */ }
  }
  if (chrome.exitCode === null) {
    await Promise.race([
      new Promise((resolveExit) => chrome.once('exit', resolveExit)),
      wait(3000),
    ]);
  }
  if (chrome.exitCode === null) {
    chrome.kill();
    await wait(1000);
  }
}

async function main() {
  const profile = await mkdtemp(join(tmpdir(), 'familyfin-browser-smoke-'));
  const port = await freePort();
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--window-size=390,844',
    `${BASE_URL}/assessment.html?assessment=entry`,
  ], { stdio: 'ignore', windowsHide: true });

  let client;
  try {
    const target = await waitForTargets(port);
    client = new CdpClient(target.webSocketDebuggerUrl);
    await client.connect();
    await Promise.all([
      client.send('Page.enable'),
      client.send('Runtime.enable'),
      client.send('Log.enable'),
      client.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
      }),
    ]);
    await waitForPage(client, '/assessment.html');

    const entryIndexes = [0, 2, 1, 3, 0, 0, 3, 2];
    const autoAdvance = await client.evaluate(`(async () => {
      const indexes = ${JSON.stringify(entryIndexes.slice(0, -1))};
      const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      for (const index of indexes) {
        const input = document.querySelectorAll('input[name="current-answer"]')[index];
        input.closest('label').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
        input.click();
        await pause(430);
      }
      return document.querySelector('#progress-text')?.textContent;
    })()`);
    assert(autoAdvance === '第 8／8 題', 'pointer selection did not auto-advance to question 8');

    await client.evaluate(`(() => {
      const input = document.querySelectorAll('input[name="current-answer"]')[${entryIndexes.at(-1)}];
      input.closest('label').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
      input.click();
      return true;
    })()`);
    await waitForPage(client, '/result.html');

    const entryResult = await client.evaluate(`(() => ({
      overviewHeading: document.querySelector('.overview-hero h1')?.textContent,
      heading: document.querySelector('.overview-entry-result h2')?.textContent,
      route: location.search,
      progress: document.querySelector('.exploration-meter strong')?.textContent,
      typeNames: [...document.querySelectorAll('.entry-type-item strong')].map((node) => node.textContent),
      branchLabels: [...document.querySelectorAll('.overview-entry-analysis .analysis-branch-label')]
        .map((node) => node.textContent),
      evidence: document.querySelectorAll('.evidence-card').length,
      analysisBranches: document.querySelectorAll('.analysis-branch').length,
      analysisNodes: document.querySelectorAll('.analysis-node').length,
      topicCards: document.querySelectorAll('.exploration-card').length,
      entryCard: Boolean([...document.querySelectorAll('.exploration-card h3')]
        .find((node) => node.textContent.includes('做金錢決定'))),
      entryRetest: document.querySelectorAll('.overview-entry-actions a').length,
      storedProgress: sessionStorage.getItem(${JSON.stringify(PROGRESS_KEY)}),
      radar: Boolean(document.querySelector('.radar')),
      toolCards: document.querySelectorAll('.tool-card').length,
      resonance: Boolean(document.querySelector('.resonance-section')),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      bodyText: document.body.innerText,
    }))()`);
    assert(entryResult.overviewHeading === '我的財務決策總覽'
      && entryResult.heading === '重視安心與準備'
      && entryResult.route === '?view=overview',
    'entry completion did not open the integrated overview');
    assert(entryResult.evidence === 0 && entryResult.analysisBranches === 2 && entryResult.analysisNodes === 6,
      'integrated entry analysis is incomplete or retained transient evidence');
    assert(JSON.stringify(entryResult.typeNames) === JSON.stringify(['安全規劃型', '精算判斷型'])
      && entryResult.branchLabels.includes('方向 1｜安全規劃型')
      && entryResult.branchLabels.includes('方向 2｜精算判斷型'),
    'entry type names are missing or not paired with their public descriptions');
    assert(entryResult.topicCards === 4 && !entryResult.entryCard && entryResult.entryRetest === 1
      && entryResult.progress === '已完成 1／5 項探索',
    'integrated overview repeats or omits an entry or extension control');
    assert(!entryResult.radar && entryResult.toolCards === 0, 'entry result must not show a radar or tools');
    assert(!entryResult.resonance && !/這份整理和你的經驗接近嗎？|很接近|有些接近|不太接近/.test(entryResult.bodyText),
      'removed result feedback prompt still appears on the entry overview');
    assert(!entryResult.overflow, 'mobile entry result has horizontal overflow');
    assert(!/(你就是|人格|弱項|高分|低分|這次的決策線索)/.test(entryResult.bodyText),
      'entry result contains removed or overstated wording');
    assert(entryResult.storedProgress && !/(answers|selections|counts|rates|average|answerId|evidence)/.test(entryResult.storedProgress),
      'same-tab progress retained raw answers or score internals');

    await client.evaluate(`location.reload()`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `document.querySelector('.overview-entry-result h2')?.textContent === '重視安心與準備'`,
      'entry result summary did not survive same-tab reload');
    const restoredEntry = await client.evaluate(`({
      evidence: document.querySelectorAll('.evidence-card').length,
      analysisBranches: document.querySelectorAll('.analysis-branch').length,
      analysisNodes: document.querySelectorAll('.analysis-node').length,
      topicCards: document.querySelectorAll('.exploration-card').length,
      progress: document.querySelector('.exploration-meter strong')?.textContent,
      typeNames: [...document.querySelectorAll('.entry-type-item strong')].map((node) => node.textContent),
      resonance: Boolean(document.querySelector('.resonance-section')),
    })`);
    assert(restoredEntry.evidence === 0 && restoredEntry.analysisBranches === 2 && restoredEntry.analysisNodes === 6
      && restoredEntry.topicCards === 4 && restoredEntry.progress === '已完成 1／5 項探索'
      && JSON.stringify(restoredEntry.typeNames) === JSON.stringify(['安全規劃型', '精算判斷型'])
      && !restoredEntry.resonance,
    'restored entry result summary is incorrect');

    const entryStateCases = [
      {
        label: 'shared',
        classification: {
          kind: 'shared', primaryKeys: ['security', 'planning'], secondaryKeys: [], focusKeys: ['security', 'planning'],
        },
        expected: ['安全規劃型、精算判斷型'],
      },
      {
        label: 'mixed with repeated directions',
        classification: {
          kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: ['present', 'adaptive', 'pause'],
        },
        expected: ['當下滿足型、彈性應變型、延後面對型'],
      },
      {
        label: 'open mixed',
        classification: { kind: 'mixed', primaryKeys: [], secondaryKeys: [], focusKeys: [] },
        expected: ['這次沒有一個傾向明顯重複出現'],
      },
      {
        label: 'insufficient',
        classification: { kind: 'insufficient', primaryKeys: [], secondaryKeys: [], focusKeys: [] },
        expected: ['這次先不套用類型'],
      },
    ];
    for (const stateCase of entryStateCases) {
      const fixture = emptyProgress();
      fixture.results.entry = {
        assessmentId: 'entry',
        classification: stateCase.classification,
        recommendedAssessmentIds: [],
      };
      await client.evaluate(`(() => {
        sessionStorage.setItem(${JSON.stringify(PROGRESS_KEY)}, ${JSON.stringify(JSON.stringify(fixture))});
        location.reload();
        return true;
      })()`);
      await waitForPage(client, '/result.html');
      await waitForCondition(client, `Boolean(document.querySelector('.entry-type-summary'))`,
        `${stateCase.label} type summary did not render`);
      const visibleTypes = await client.evaluate(`([...document.querySelectorAll('.entry-type-item strong')]
        .map((node) => node.textContent))`);
      assert(JSON.stringify(visibleTypes) === JSON.stringify(stateCase.expected),
        `${stateCase.label} type presentation is incorrect`);
    }

    await client.evaluate(`(() => {
      sessionStorage.setItem(${JSON.stringify(PROGRESS_KEY)}, ${JSON.stringify(entryResult.storedProgress)});
      location.reload();
      return true;
    })()`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `document.querySelector('.overview-entry-result h2')?.textContent === '重視安心與準備'`,
      'entry result did not restore after type-state checks');

    await client.evaluate(`location.href = './result.html?assessment=entry'`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `Boolean(document.querySelector('.overview-entry-result'))`,
      'legacy entry result route did not open the integrated overview');
    const legacyEntryRoute = await client.evaluate(`({
      route: location.search,
      overviewHeading: document.querySelector('.overview-hero h1')?.textContent,
      entryHeading: document.querySelector('.overview-entry-result h2')?.textContent,
      typeNames: [...document.querySelectorAll('.entry-type-item strong')].map((node) => node.textContent),
    })`);
    assert(legacyEntryRoute.route === '?view=overview'
      && legacyEntryRoute.overviewHeading === '我的財務決策總覽'
      && legacyEntryRoute.entryHeading === '重視安心與準備'
      && legacyEntryRoute.typeNames.includes('安全規劃型'),
    'legacy entry result route was not canonicalized');

    await client.evaluate(`location.href = './assessment.html?assessment=entry'`);
    await waitForPage(client, '/assessment.html');
    const keyboardFlow = await client.evaluate(`(async () => {
      const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const input = document.querySelector('input[name="current-answer"]');
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      await pause(450);
      const before = document.querySelector('#progress-text')?.textContent;
      const enabled = !document.querySelector('#next')?.disabled;
      document.querySelector('#next').click();
      const after = document.querySelector('#progress-text')?.textContent;
      return { before, enabled, after };
    })()`);
    assert(keyboardFlow.before === '第 1／8 題' && keyboardFlow.enabled && keyboardFlow.after === '第 2／8 題',
      'keyboard answer should wait for the Next button');

    const planAnswers = optionIds('plan', ['A4', 'A4', 'A4', 'A4', 'A1', 'A1']);
    await client.evaluate(`(() => {
      sessionStorage.setItem(${JSON.stringify(STORAGE_KEY)}, JSON.stringify({
        version: ${ATTEMPT_VERSION},
        assessmentId: 'plan',
        answers: ${JSON.stringify(planAnswers)},
        finished: true,
      }));
      location.href = './result.html';
      return true;
    })()`);
    await waitForPage(client, '/result.html');
    const expanded = await client.evaluate(`(() => ({
      heading: document.querySelector('.result-hero h1')?.textContent,
      disclosureOpen: document.querySelector('.tool-disclosure')?.open,
      firstToolVisible: document.querySelector('.tool-card')?.checkVisibility?.() ?? false,
      analysisBranches: document.querySelectorAll('.analysis-branch').length,
      analysisNodes: document.querySelectorAll('.analysis-node').length,
      topicCards: document.querySelectorAll('.exploration-card').length,
      resonance: Boolean(document.querySelector('.resonance-section')),
      backLink: document.querySelector('#result-back-link')?.textContent,
      overviewAction: [...document.querySelectorAll('.result-actions a')]
        .some((link) => link.textContent.includes('回到我的財務決策總覽')
          && link.href.includes('result.html?view=overview')),
      firstAction: document.querySelector('.result-actions a')?.textContent,
      primaryAction: document.querySelector('.result-actions a.button-primary')?.textContent,
      quietAction: document.querySelector('.result-actions a.button-quiet')?.textContent,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    }))()`);
    assert(expanded.heading === '想準備完整再開始', 'extension result heading is incorrect');
    assert(expanded.analysisBranches === 2 && expanded.analysisNodes === 6,
      'extension result did not preserve every detected direction in the analysis');
    assert(expanded.disclosureOpen === true && expanded.firstToolVisible === true,
      'extension tools must start expanded');
    assert(expanded.topicCards === 0, 'extension result repeats the exploration overview');
    assert(!expanded.resonance && expanded.backLink?.includes('回到我的財務決策總覽')
      && expanded.overviewAction
      && expanded.firstAction?.includes('回到我的財務決策總覽')
      && expanded.primaryAction?.includes('回到我的財務決策總覽')
      && expanded.quietAction?.includes('重新測驗這個主題'),
      'extension result order or overview navigation is incorrect');
    assert(!expanded.overflow, 'mobile extension result has horizontal overflow');

    const tools = await client.evaluate(`([...document.querySelectorAll('.tool-card h3')]
      .map((node) => node.textContent))`);
    assert(JSON.stringify(tools) === JSON.stringify(['儲蓄目標試算', '生活目標財務規劃', '財務健康儀表板']),
      'extension tool route is incorrect');
    await capturePage(client, EXTENSION_ARTIFACT);

    await client.evaluate(`location.href = './result.html?view=overview'`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `Boolean(document.querySelector('.overview-hero'))`, 'overview did not render');
    const overview = await client.evaluate(`(() => ({
      cards: document.querySelectorAll('.exploration-card').length,
      complete: document.querySelectorAll('.exploration-status.is-complete').length,
      progress: document.querySelector('.exploration-meter strong')?.textContent,
      resultLinks: [...document.querySelectorAll('.exploration-actions a')]
        .filter((link) => link.textContent.includes('查看摘要與分析')).length,
      retestLinks: [...document.querySelectorAll('.exploration-actions a')]
        .filter((link) => link.textContent.includes('重新測驗')).length,
      entryCard: Boolean([...document.querySelectorAll('.exploration-card h3')]
        .find((node) => node.textContent.includes('做金錢決定'))),
      entryRetest: document.querySelectorAll('.overview-entry-actions a').length,
      completionVisible: Boolean(document.querySelector('.completion-synthesis')),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    }))()`);
    assert(overview.cards === 4 && overview.complete === 1 && overview.progress === '已完成 2／5 項探索',
      'overview completion state is incorrect');
    assert(overview.resultLinks === 1 && overview.retestLinks === 1
      && !overview.entryCard && overview.entryRetest === 1,
      'overview does not provide result and retest actions');
    assert(!overview.completionVisible, 'combined analysis appeared before all five explorations were complete');
    assert(!overview.overflow, 'mobile overview has horizontal overflow');
    await capturePage(client, MOBILE_ARTIFACT);

    const completeProgress = completeProgressFixture();
    await client.evaluate(`(() => {
      sessionStorage.setItem(${JSON.stringify(PROGRESS_KEY)}, ${JSON.stringify(JSON.stringify(completeProgress))});
      location.reload();
      return true;
    })()`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `Boolean(document.querySelector('.completion-synthesis'))`,
      'five-part combined analysis did not render');
    const completeOverview = await client.evaluate(`(() => ({
      title: document.querySelector('.completion-heading h2')?.textContent,
      nodes: document.querySelectorAll('.decision-map-node').length,
      linkedNodes: document.querySelectorAll('a.decision-map-node').length,
      entryNodeIsLink: Boolean(document.querySelector('a.decision-map-node-entry')),
      combinedParagraphs: document.querySelectorAll('.combined-analysis p').length,
      synthesisHeading: document.querySelector('.combined-analysis h3')?.textContent,
      connectionCards: document.querySelectorAll('.synthesis-connection-card').length,
      balanceCards: document.querySelectorAll('.synthesis-balance-card').length,
      nextStep: document.querySelector('.synthesis-next-step p')?.textContent,
      toolsHeading: document.querySelector('.completion-tools h3')?.textContent,
      completionTools: [...document.querySelectorAll('.completion-tools .tool-card h3')]
        .map((node) => node.textContent),
      completionToolLinksValid: [...document.querySelectorAll('.completion-tools .tool-card a')]
        .every((link) => link.target === '_blank' && link.rel.includes('noopener') && link.rel.includes('noreferrer')),
      completionPrimaryTools: document.querySelectorAll('.completion-tools .tool-card-primary').length,
      oldRelatedSection: Boolean(document.querySelector('.combined-related')),
      progress: document.querySelector('.exploration-meter strong')?.textContent,
      topicResultLinks: [...document.querySelectorAll('.exploration-actions a')]
        .filter((link) => link.textContent.includes('查看摘要與分析')).length,
      cards: document.querySelectorAll('.exploration-card').length,
      completeCards: document.querySelectorAll('.exploration-status.is-complete').length,
      entryCard: Boolean([...document.querySelectorAll('.exploration-card h3')]
        .find((node) => node.textContent.includes('做金錢決定'))),
      entryRetest: document.querySelectorAll('.overview-entry-actions a').length,
      bodyText: document.body.innerText,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    }))()`);
    assert(completeOverview.title === '恭喜你完成 5 項探索'
      && completeOverview.nodes === 5 && completeOverview.linkedNodes === 4
      && !completeOverview.entryNodeIsLink,
    'combined decision map structure is incorrect');
    assert(completeOverview.combinedParagraphs >= 4
      && completeOverview.synthesisHeading === '我的綜合評估摘要'
      && completeOverview.connectionCards === 2
      && completeOverview.balanceCards === 2
      && Boolean(completeOverview.nextStep)
      && completeOverview.progress === '已完成 5／5 項探索',
    'combined analysis narrative or completion state is missing');
    assert(completeOverview.toolsHeading === '嘗試使用以下工具'
      && completeOverview.completionTools.length === 3
      && new Set(completeOverview.completionTools).size === 3
      && completeOverview.completionPrimaryTools === 1
      && completeOverview.completionToolLinksValid
      && !completeOverview.oldRelatedSection,
    'completion tool recommendations are missing, duplicated, or use the old related-topic section');
    assert(completeOverview.topicResultLinks === 4 && completeOverview.cards === 4
      && completeOverview.completeCards === 4 && !completeOverview.entryCard
      && completeOverview.entryRetest === 1,
    'entry should be integrated while four extension summaries remain available');
    assert(/不是心理或財務診斷/.test(completeOverview.bodyText)
      && !/(雷達|總分：|高分|低分|弱項|接下來可以從這裡看)/.test(completeOverview.bodyText),
    'combined analysis boundary is missing or misleading scoring language appeared');
    assert(!completeOverview.overflow, 'mobile combined analysis has horizontal overflow');
    await capturePage(client, COMPLETE_ARTIFACT);

    for (const width of [360, 393, 430, 1280]) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: width === 1280 ? 900 : 844,
        deviceScaleFactor: 1,
        mobile: width !== 1280,
      });
      const state = await client.evaluate(`({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        nodes: document.querySelectorAll('.decision-map-node').length,
      })`);
      assert(!state.overflow && state.nodes === 5, `combined analysis is invalid at ${width}px`);
      if (width === 1280) await capturePage(client, COMPLETE_DESKTOP_ARTIFACT);
    }

    const planResultUrl = await client.evaluate(`(() => [...document.querySelectorAll('.exploration-card')]
      .find((card) => card.querySelector('h3')?.textContent === '我的財務計畫卡在哪裡？')
      ?.querySelector('.exploration-actions a.button-primary')?.href)()`);
    assert(planResultUrl?.includes('result.html?assessment=plan'), 'overview result-summary link points to the wrong route');
    await client.evaluate(`(() => [...document.querySelectorAll('.exploration-card')]
      .find((card) => card.querySelector('h3')?.textContent === '我的財務計畫卡在哪裡？')
      ?.querySelector('.exploration-actions a.button-primary')?.click())()`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `document.querySelector('.result-hero h1')?.textContent === '想準備完整再開始'`,
      'stored extension result summary did not open');
    const restoredPlan = await client.evaluate(`({
      evidence: document.querySelectorAll('.evidence-card').length,
      tools: document.querySelectorAll('.tool-card').length,
      disclosureOpen: document.querySelector('.tool-disclosure')?.open,
      topicCards: document.querySelectorAll('.exploration-card').length,
      back: document.querySelector('#result-back-link')?.textContent,
      resonance: Boolean(document.querySelector('.resonance-section')),
    })`);
    assert(restoredPlan.evidence === 0 && restoredPlan.tools === 3
      && restoredPlan.disclosureOpen && restoredPlan.topicCards === 0
      && restoredPlan.back?.includes('回到我的財務決策總覽') && !restoredPlan.resonance,
    'extension result summary route is incomplete or loops back into the overview');

    for (const width of [360, 393, 430]) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
      });
      const overflow = await client.evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
      assert(!overflow, `result summary overflows at ${width}px`);
    }

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.evaluate(`location.href = './assessment.html?assessment=entry'`);
    await waitForPage(client, '/assessment.html');
    await client.evaluate(`(() => {
      sessionStorage.setItem(${JSON.stringify(STORAGE_KEY)}, JSON.stringify({
        version: ${ATTEMPT_VERSION},
        assessmentId: 'entry',
        answers: ${JSON.stringify(optionIds('entry', ['security', 'planning', 'security', 'security', 'planning', 'achievement', 'planning', 'security']))},
        finished: true,
      }));
      location.href = './result.html';
      return true;
    })()`);
    await waitForPage(client, '/result.html');
    const desktop = await client.evaluate(`({
      width: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      overviewHeading: document.querySelector('.overview-hero h1')?.textContent,
      heading: document.querySelector('.overview-entry-result h2')?.textContent,
      cards: document.querySelectorAll('.exploration-card').length,
    })`);
    assert(desktop.width === 1280 && !desktop.overflow
      && desktop.overviewHeading === '我的財務決策總覽'
      && desktop.heading === '重視安心與準備' && desktop.cards === 4,
    'desktop integrated overview is invalid');
    await capturePage(client, DESKTOP_ARTIFACT);

    await client.evaluate(`location.reload()`);
    await waitForPage(client, '/result.html');
    await waitForCondition(client, `document.querySelector('.overview-entry-result h2')?.textContent === '重視安心與準備'`,
      'desktop result summary did not survive reload');
    const desktopReload = await client.evaluate(`({
      evidence: document.querySelectorAll('.evidence-card').length,
      topicCards: document.querySelectorAll('.exploration-card').length,
      resonance: Boolean(document.querySelector('.resonance-section')),
    })`);
    assert(desktopReload.evidence === 0 && desktopReload.topicCards === 4 && !desktopReload.resonance,
      'desktop reload did not preserve minimal progress');

    assert(client.errors.length === 0, `browser console errors: ${client.errors.join(' | ')}`);
    console.log(JSON.stringify({
      status: 'passed',
      baseUrl: BASE_URL,
      autoAdvance,
      entryResult: entryResult.heading,
      extensionResult: expanded.heading,
      overview: overview.progress,
      tools,
      keyboardFlow,
      mobileScreenshot: MOBILE_ARTIFACT,
      completeScreenshot: COMPLETE_ARTIFACT,
      completeDesktopScreenshot: COMPLETE_DESKTOP_ARTIFACT,
      extensionScreenshot: EXTENSION_ARTIFACT,
      desktopScreenshot: DESKTOP_ARTIFACT,
      consoleErrors: client.errors,
    }, null, 2));
  } finally {
    await closeOwnedChrome(chrome, client);
    const resolvedProfile = resolve(profile);
    const resolvedTemp = `${resolve(tmpdir())}${sep}`;
    if (resolvedProfile.startsWith(resolvedTemp)
      && basename(resolvedProfile).startsWith('familyfin-browser-smoke-')) {
      let removed = false;
      for (let attempt = 0; attempt < 6 && !removed; attempt += 1) {
        try {
          await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 4, retryDelay: 200 });
          removed = true;
        } catch (error) {
          if (attempt === 5) console.warn(`Temporary Chrome profile remains at ${resolvedProfile}: ${error.code}`);
          else await wait(500);
        }
      }
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
