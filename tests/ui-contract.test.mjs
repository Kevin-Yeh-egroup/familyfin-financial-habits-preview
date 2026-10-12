import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');

test('all pages use the 1+4 title and one cache version', async () => {
  const pages = await Promise.all(['index.html', 'assessment.html', 'result.html'].map(read));
  assert.match(pages[0], /做金錢決定時/);
  assert.match(pages[0], /我通常先在意什麼/);
  assert.match(pages[0], /8 個生活選擇/);
  assert.match(pages[0], /入口探索＋4 個生活主題/);
  for (const page of pages) {
    assert.match(page, /styles\.css\?v=20260923-v11-7/);
    assert.match(page, /app\.mjs\?v=20260923-v11-7/);
    assert.match(page, /<meta name="robots" content="noindex,nofollow,noarchive">/);
  }
});

test('assessment uses question position, forced choice, pointer auto-advance, and keyboard Next', async () => {
  const [assessment, app] = await Promise.all([read('assessment.html'), read('app.mjs')]);
  assert.match(assessment, /第 1／8 題/);
  assert.match(assessment, /aria-live="polite"/);
  assert.match(app, /我沒有遇過這個狀況/);
  assert.match(app, /pointerSelection/);
  assert.match(app, /scheduleAdvance\(current, fieldset\)/);
  assert.match(app, /380/);
  assert.match(app, /請先選一個答案/);
  assert.doesNotMatch(`${assessment}\n${app}`, /清除作答並從第一題重來|答案只在這個分頁暫存|不確定如何回答/);
});

test('result stays focused, keeps topics on the overview, and opens tools by default', async () => {
  const [app, view, scoring, progress] = await Promise.all([
    read('app.mjs'), read('result-view.mjs'), read('scoring.mjs'), read('progress.mjs'),
  ]);
  const combined = `${app}\n${view}\n${scoring}\n${progress}`;
  for (const phrase of [
    '結果摘要與分析',
    '哪些選擇帶出這個結果',
    '我的財務決策總覽',
    '查看摘要與分析',
    '重新測驗',
    '用剛剛整理的內容繼續',
    '恭喜你完成 5 項探索',
    '我的財務決策地圖',
    '我的綜合評估摘要',
    '從資訊走到行動',
    '壓力與關係如何改變順序',
    '可以繼續保留的做法',
    '值得替自己多留一點空間',
    '嘗試使用以下工具',
  ]) assert.match(combined, new RegExp(phrase));
  assert.match(view, /已完成 \$\{count\}／\$\{ASSESSMENT_ORDER\.length\} 項探索/);
  assert.match(view, /<details|element\('details'/);
  assert.match(view, /details\.open = true/);
  assert.match(view, /ASSESSMENT_ORDER\.forEach/);
  assert.match(view, /assessment\.id !== 'entry'/);
  assert.match(view, /combinedAnalysisModel/);
  assert.match(view, /decision-map-node/);
  assert.match(view, /profiles\.length > 1/);
  assert.match(view, /這次的選項不會自動帶入/);
  assert.match(view, /root\.append\(renderBottomActions\(result\)\)/);
  assert.match(view, /renderEntryOverview/);
  assert.match(view, /if \(id === 'entry' && entryComplete\) return/);
  assert.match(view, /renderProgressOverview\(root, progress, currentEntryResult = null\)/);
  assert.match(app, /if \(result\.assessmentId === 'entry'\)/);
  assert.match(app, /showOverview\(result, true\)/);
  assert.match(app, /if \(requestedId === 'entry' && snapshot\)/);
  assert.doesNotMatch(combined, /makeRadar|雷達圖|你就是|人格|弱項|高風險|這次沒有硬指定主工具/);
  assert.doesNotMatch(combined, /接下來想看哪個主題|查看結果摘要/);
  assert.match(app, /result-back-link/);
  assert.doesNotMatch(combined, /這次的決策線索|embedded: true/);
  assert.doesNotMatch(combined, /renderResonance|resonance-|這份整理和你的經驗接近嗎|很接近|有些接近|不太接近/);
  assert.doesNotMatch(view, /回到我的探索總覽/);
  assert.match(view, /回到我的財務決策總覽/);
  assert.match(view, /linkButton\('回到我的財務決策總覽',[\s\S]*?'button-primary'\)[\s\S]*?linkButton\('重新測驗這個主題',[\s\S]*?'button-quiet'\)/);
  assert.doesNotMatch(view, /看看其他主題|more-topics|決定裡的力量|這個考量在保護什麼|想知道更多/);
  assert.doesNotMatch(view, /接下來可以從這裡看|回看這個主題|建議先從這項開始/);
  assert.match(view, /可以先從這項開始/);
  assert.match(view, /入口結果已整理在上方/);
  assert.match(view, /四個延伸主題/);
  assert.match(view, /renderEntryTypes/);
  assert.match(view, /entry-type-summary/);
  assert.match(scoring, /entryTypeModel/);
  assert.match(scoring, /typeName/);
  assert.doesNotMatch(combined, /internalName/);
});

test('entry contains no tools and extensions show one primary plus at most two related resources', async () => {
  const [view, scoring] = await Promise.all([read('result-view.mjs'), read('scoring.mjs')]);
  assert.match(scoring, /assessment\.kind === 'entry_tendency'\) return null/);
  assert.match(scoring, /\.slice\(0, 2\)/);
  assert.match(view, /tool-card-primary/);
});

test('five-part completion renders three deduplicated tools from the progress model', async () => {
  const [view, progress] = await Promise.all([read('result-view.mjs'), read('progress.mjs')]);
  assert.match(view, /completionToolRecommendations\(progress\)/);
  assert.match(view, /recommendations\.items\.forEach/);
  assert.match(view, /嘗試使用以下工具/);
  assert.match(progress, /Give every completed topic one turn/);
  assert.match(progress, /seen\.has\(key\)/);
  assert.match(progress, /basis: 'fallback'/);
});

test('public copy omits internal test and fixed-personality language while exposing approved type names', async () => {
  const files = await Promise.all([
    'index.html', 'assessment.html', 'result.html', 'app.mjs', 'result-view.mjs', 'data.mjs', 'scoring.mjs',
  ].map(read));
  const combined = files.join('\n');
  assert.doesNotMatch(combined, /夥伴測試|測試預覽|非正式量表|最近三個月|答案怎麼處理|可計分回答|平均分數/);
  for (const typeName of [
    '安全規劃型', '當下滿足型', '精算判斷型', '行動嘗試型',
    '關係照顧型', '成就證明型', '彈性應變型', '延後面對型',
  ]) assert.match(combined, new RegExp(typeName));
  assert.doesNotMatch(combined, /你就是|你是(?:安全規劃型|當下滿足型|精算判斷型|行動嘗試型|關係照顧型|成就證明型|彈性應變型|延後面對型)/);
});

test('attempt handoff is one-shot and same-tab progress excludes raw answers', async () => {
  const [app, progress] = await Promise.all([read('app.mjs'), read('progress.mjs')]);
  assert.match(app, /sessionStorage\.setItem/);
  assert.match(app, /sessionStorage\.removeItem/);
  assert.match(app, /consumeTransfer/);
  assert.match(app, /PROGRESS_KEY/);
  assert.match(progress, /classification/);
  assert.doesNotMatch(progress, /\.answers|\.selections|\.counts|\.rates|\.average|answerId/);
  assert.doesNotMatch(`${app}\n${progress}`, /localStorage|indexedDB/);
});

test('public security policy stays self-contained and partner-only guide remains excluded', async () => {
  const [config, robots, ignore] = await Promise.all([read('vercel.json'), read('robots.txt'), read('.vercelignore')]);
  assert.match(config, /connect-src 'none'/);
  assert.match(config, /img-src 'self' data:/);
  assert.match(robots, /User-agent: \*/);
  assert.match(ignore, /^partner-guide\.html$/m);
});
