# Vercel 正式問卷發布紀錄

## 2026-09-23｜總覽整合與移除未保存回饋 v11-7

- 發布時間：2026-09-23 16:09（Asia/Taipei）
- 成熟度：`validation-ready`；供夥伴試填與認知訪談，不宣稱正式量表效度、人格分類、診斷或完整財務評估
- Vercel project：`egroup-task3s-projects/familyfin-financial-habits-preview`
- Deployment ID：`dpl_FXzHgRyjzEVwwid4JHwwNyE8GkNe`
- Production status：`READY`
- 固定網址：<https://familyfin-financial-habits-preview.vercel.app/>
- Deployment URL：<https://familyfin-financial-habits-preview-cbzod3r5f.vercel.app/>
- 前端快取：`20260923-v11-7`
- 公開調整：入口探索結果整合至財務決策總覽；個別結果將「回到我的財務決策總覽」設為主要操作；完成五項後顯示跨面向綜合評估與三項不重複工具；完整移除「這份整理和你的經驗接近嗎？」及三個回饋選項、事件與樣式。
- 資料邊界：不保存上述回饋；同分頁進度只保留顯示摘要所需的分類結果，不保存逐題答案、分數或證據。
- 發布方式：由 artifact-specific `publish-ready/familyfin-financial-habits-preview/` 靜態包直接部署；未建立或推送 GitHub commit。

### 本次驗收

- 30／30 Node 測試與五個 JavaScript module syntax check 通過。
- 固定網址實際走完「首頁 → 8 題入口 → 總覽 → 6 題延伸 → 結果 → 總覽」；滑鼠選答自動前進，鍵盤「下一題」流程通過。
- 390px 行動版與 1280px 桌面版無水平溢出；入口、延伸結果及總覽均未出現已移除的回饋區塊；瀏覽器 console 無 error。
- 五項完成狀態顯示綜合評估摘要與三項不重複工具；並列、混合及資料不足的工具 fallback 契約測試通過。
- 正式站 11 個公開檔案 SHA-256 與發布包逐檔相符；首頁、作答頁、結果頁及公開資源為 HTTP 200。
- `partner-guide.html`、Markdown、測試、產生器與 `.vercel` 路徑為 HTTP 404。
- CSP、`nosniff`、Referrer-Policy、Permissions-Policy、`X-Frame-Options: DENY` 與 `X-Robots-Tag: noindex, nofollow, noarchive` 已由固定網址回讀。
- `robots.txt` 延續既有 `Allow: /` 決策，讓爬蟲可以讀取頁面上的 meta 與 header noindex；網址仍為公開可存取，noindex 不是權限控管。

### 回復點

- 上一版部署：`dpl_8xXAUGHPRxvZiimXpMbTEzz2v6vU`（結果圖像與五項綜合分析 v11-3）。

## 2026-09-23｜結果圖像與五項綜合分析 v11-3

- 發布時間：2026-09-23 14:28（Asia/Taipei）
- 成熟度：`validation-ready`；供夥伴試填與認知訪談，不宣稱正式量表效度、人格分類、診斷或完整財務評估
- Vercel project：`egroup-task3s-projects/familyfin-financial-habits-preview`
- Deployment ID：`dpl_8xXAUGHPRxvZiimXpMbTEzz2v6vU`
- Production status：`READY`
- 固定網址：<https://familyfin-financial-habits-preview.vercel.app/>
- Deployment URL：<https://familyfin-financial-habits-preview-disc2kweq.vercel.app/>
- 前端快取：`20260923-v11-3`
- 公開調整：單項結果新增摘要、溫暖分析敘述與三節點決策路徑；總覽統一為「我的財務決策總覽」；入口完成卡只保留重新測驗；完成五項後顯示祝賀、1＋4 決策地圖、綜合整理及入口路由支持的下一步提問。
- 資料邊界：同分頁摘要仍只保留 assessment id、分類鍵與入口推薦主題；不保存逐題答案、分數、證據、共鳴選擇或使用者選看的工具分支。
- 發布方式：由 artifact-specific `publish-ready/familyfin-financial-habits-preview/` 靜態包直接部署；未建立或推送 GitHub commit。

### 本次驗收

- 25／25 Node 測試與五個 JavaScript module syntax check 通過。
- 正式網址完整走過入口作答、自動前進、鍵盤「下一題」、入口結果、延伸結果、工具展開、探索總覽、結果回看與五項綜合分析；瀏覽器 console 無 error。
- 360px、393px、430px 與 1280px 均無水平溢出；單項分析於手機改為直向路徑，五項決策地圖於手機改為直向節點。
- 並列與混合結果會先完整呈現所有方向；只有兩個以上可延伸方向才要求選擇，小步驟與工具選擇不會改寫結果。
- 入口完成卡只有「重新測驗」；四個延伸主題可查看摘要與分析或重新測驗；個別結果返回「我的財務決策總覽」。
- 五項綜合圖沒有分數、雷達、排行或高低暗示，並標示五個角度不合成總分或完整財務評估。
- 固定網址的公開資源與發布包 SHA-256 相符；首頁、作答頁、結果頁與公開資源為 HTTP 200，內部指南、Markdown、測試、產生器與 `.vercel` 路徑為 HTTP 404。
- CSP、`nosniff`、Referrer-Policy、Permissions-Policy、`X-Frame-Options: DENY` 與 `X-Robots-Tag: noindex, nofollow, noarchive` 已由固定網址回讀。

### 回復點

- 上一版部署：`dpl_3LAZoASgp6aB3QFik8i3RhhZNSpf`（結果頁導覽收斂 v11-2）。

## 2026-09-23｜結果頁導覽收斂 v11-2

- 發布時間：2026-09-23 12:39（Asia/Taipei）
- 成熟度：`validation-ready`；供夥伴試填與認知訪談，不宣稱正式量表效度、人格分類或診斷用途
- Vercel project：`egroup-task3s-projects/familyfin-financial-habits-preview`
- Deployment ID：`dpl_3LAZoASgp6aB3QFik8i3RhhZNSpf`
- Production status：`READY`
- 固定網址：<https://familyfin-financial-habits-preview.vercel.app/>
- Deployment URL：<https://familyfin-financial-habits-preview-blj6z5l4x.vercel.app/>
- 前端快取：`20260923-v11-2`
- 公開調整：移除「這次的決策線索」；將共鳴題移到結果頁最末；個別結果不再重複嵌入探索總覽；刪除底部返回總覽按鈕並保留頁首文字返回路徑；延伸工具區預設展開。
- 資料邊界：未調整題目、計分、工具分流或同分頁最小摘要 schema。

### 本次驗收

- 23／23 Node 測試與五個 JavaScript module syntax check 通過。
- 正式網址以 390px 完整走完入口 8 題與延伸 6 題；滑鼠自動前進與鍵盤「下一題」均正常。
- 從探索總覽實際點擊「查看結果摘要」，正確開啟指定主題；個別結果頁沒有五張總覽卡或重複的摘要按鈕。
- 延伸工具區初始為展開狀態；「這份整理和你的經驗接近嗎？」為結果根節點最後一區；頁首可返回總覽，底部不再顯示返回總覽按鈕。
- 360px、393px、430px 與 1280px 均無水平溢出；瀏覽器 console 無 error。
- 正式站 11 個公開檔案 SHA-256 與發布包相符；首頁與公開資源為 HTTP 200，`partner-guide.html` 與 `DESIGN.draft.md` 為 HTTP 404。
- CSP、`X-Frame-Options: DENY` 與 `X-Robots-Tag: noindex, nofollow, noarchive` 已由固定網址回讀；部署後未發現 error 或 5xx request logs。

### 回復點

- 上一版部署：`dpl_G3KGcCvQvfS6Ny9dvEzjM7EpApR2`（探索總覽與結果回看 v11）。

## 2026-09-23｜探索總覽與結果回看 v11

- 發布時間：2026-09-23 12:19（Asia/Taipei）
- 成熟度：`validation-ready`；供夥伴試填與認知訪談，不宣稱正式量表效度、人格分類或診斷用途
- Vercel project：`egroup-task3s-projects/familyfin-financial-habits-preview`
- Deployment ID：`dpl_G3KGcCvQvfS6Ny9dvEzjM7EpApR2`
- Production status：`READY`
- 固定網址：<https://familyfin-financial-habits-preview.vercel.app/>
- Deployment URL：<https://familyfin-financial-habits-preview-b9golxow4.vercel.app/>
- 前端快取：`20260923-v11-1`
- 公開內容：入口結果說明合併為單一觀察區；首頁提供入口與四個延伸主題的探索總覽、完成狀態、結果摘要回看及單一主題重測。
- 資料邊界：逐題原始答案仍只做一次性交接；同一分頁僅保留顯示結果所需的最小摘要，不建立會員紀錄、跨分頁紀錄、總分或跨主題人格推論。
- 公開邊界：內部 Markdown、測試、產生器、計分指南與夥伴說明頁均未部署；保留全站 `noindex, nofollow, noarchive`。

### 本次驗收

- 23／23 Node 測試與五個 JavaScript module syntax check 通過。
- 正式網址以滑鼠走完入口 8 題與任一延伸 6 題，驗證自動前進、入口結果、延伸結果、回到探索總覽、已完成狀態、結果摘要回看與重測入口。
- 鍵盤選答後「下一題」可用；360px、393px、430px 與 1280px 均無水平溢出，瀏覽器 console 無 error。
- 結果工具依序顯示「儲蓄目標試算」、「生活目標財務規劃」與「財務健康儀表板」。
- 固定網址的 3 個 HTML、5 個 JavaScript module、CSS 與 `robots.txt` 皆與發布包 SHA-256 相符；首頁、作答頁、結果頁與公開資源回傳 HTTP 200。
- `partner-guide.html`、`DESIGN.draft.md` 等內部路徑回傳 HTTP 404；CSP、`X-Frame-Options: DENY` 與 `X-Robots-Tag: noindex, nofollow, noarchive` 已由固定網址回讀。
- 部署後查詢未發現 error 或 5xx request logs；此靜態網站沒有 runtime function。

### 回復點

- 上一版部署：`dpl_CjYRZycXCQ6t8xfuUHHzijxbCixb`（同日 1＋4 財務決策覺察夥伴測試版）。

## 2026-09-23｜1＋4 財務決策覺察夥伴測試版

- 發布時間：2026-09-23 11:20（Asia/Taipei）
- 成熟度：`validation-ready`；供夥伴試填，不宣稱正式量表效度、人格分類或診斷用途
- Vercel project：`egroup-task3s-projects/familyfin-financial-habits-preview`
- Deployment ID：`dpl_CjYRZycXCQ6t8xfuUHHzijxbCixb`
- Production status：`READY`
- 固定網址：<https://familyfin-financial-habits-preview.vercel.app/>
- 版本：`decision-awareness-1plus4-v1.0`；attempt schema `10`；前端快取 `20260923-v10-2`
- 公開內容：1 個 8 題入口檢測、4 個各 6 題延伸檢測、描述性結果、約 10 分鐘小步驟與依結果分流的工具建議
- 公開邊界：內部 Markdown、測試、產生器、計分指南與夥伴說明頁均未部署；保留全站 `noindex, nofollow, noarchive`

### 本次驗收

- 19／19 Node 測試與四個 JavaScript module syntax check 通過。
- 固定網址以 390px 完整走完入口 8 題與延伸 6 題；滑鼠選答自動前進，鍵盤可按「下一題」。
- 入口結果顯示「重視安心與準備」案例；延伸結果顯示「想準備完整再開始」，展開後依序連到「儲蓄目標試算」、「生活目標財務規劃」與「財務健康儀表板」。
- 360px 首頁標題自然分成兩行，無孤字與水平溢出；390px 行動版與 1280px 桌機結果頁亦無水平溢出。
- 作答結果只交接一次；結果頁重新整理後回到空狀態。瀏覽器 console 無 error。
- 首頁、五個檢測入口、結果與公開資源皆為 HTTP 200；favicon 為 200；夥伴計分頁、Markdown 與測試路徑為 404。
- CSP 與 `X-Robots-Tag: noindex, nofollow, noarchive` 已由固定網址回讀。

### 回復點

- 上一版部署：`dpl_29opsy5cd1AJ2uVUMTYNfoJqEurb`（同日首次 1＋4 部署）。
- 舊 18 題版本：`dpl_2Ya84oXT69SkcdhbmnAsosJkCbwW`。

- 發布時間：2026-09-16 17:56（Asia/Taipei）
- 成熟度：`build-ready`／正式問卷介面；結果為描述性整理，不宣稱量表效度或診斷用途
- Vercel project：`egroup-task3s-projects/familyfin-financial-habits-preview`
- Deployment ID：`dpl_2Ya84oXT69SkcdhbmnAsosJkCbwW`
- Production status：`READY`
- 固定網址：<https://familyfin-financial-habits-preview.vercel.app/>
- 計分方法文件：保留於工作區供內部參考，不隨公開網站部署
- 不公開收錄：HTML `noindex,nofollow,noarchive` 與全站 `X-Robots-Tag`。`robots.txt` 採 `Allow: /`，讓爬蟲能讀到 noindex 指令；這不是允許收錄。
- 存取界線：網址可直接存取；noindex 不是密碼或權限控管。
- 發布方式：乾淨靜態包直接部署，未建立或推送 GitHub repository。
- 推薦規則：`lower-frequency-support-v0.2`；結果摘要：`result-summary-v0.2`；公開工具目錄版本 `familyfin-toolbox-assessment-2026-09-16`。
- 題目版本：`financial-habits-18-v0.7`；計分版本：`dimension-mean-min2of3-v2`。
- 前端快取版本：`20260916-17`。

## 發布包

`publish-ready/familyfin-financial-habits-preview/` 對外僅部署說明、作答與結果三個 HTML，以及 CSS、三個 JavaScript module、`robots.txt` 與 `vercel.json`。測試、設計稿、內部 review brief、夥伴計分頁與 Markdown 計分文件均未上傳；夥伴計分頁公開網址已確認為 404。

## 驗收證據

- 24 項 Node 測試全數通過；`app.mjs`、`data.mjs` 與 `scoring.mjs` syntax check 通過。
- 首頁、檢測與結果頁均 HTTP 200；內部夥伴計分頁為 HTTP 404。
- 安全標頭已回讀：CSP、`nosniff`、Referrer-Policy、Permissions-Policy、X-Frame-Options、X-Robots-Tag。
- 公開網址實走 18 題：金錢掌握為唯一較少採用面向時，依序推薦「記帳助理」、「財務月報表」與「財務健康儀表板」；六個面向皆為實心點。
- 單一面向 2／3 題可計分時：以一個空心點呈現兩題平均，三項通用工具等權且沒有 featured card。
- 單一面向 1／3 題可計分時：該軸標示「資料不足」，不補零、不封閉、不填色；相鄰有效點只畫四段連線。
- 重新檢測：回到第 1 題、0 個選項被選取、下一題 disabled。
- 393×852px 結果頁與 390×844px 作答頁均無橫向溢出；390px 六個選項維持至少 46px 觸控高度且未被底部操作列遮擋。
- 第 2 題已改為「安排每個月的花費時，我會先留好房租、水電等固定支出需要的錢。」；正式站 360px 為自然三行，選答後直接前進且捲動位置不變。
- 第 5 題已改為「想買不是生活必需的東西時，我會先確認生活費夠不夠。」；正式站 390px 與桌面版均無水平溢出，選答後直接前進至第 6 題。
- 說明頁與作答提示已全面移除「最近三個月」，改為平常實際做法；首頁主視覺的暫存／每次重來說明已移除。正式站 390px 與 1280px 均無水平溢出，首頁可由鍵盤進入作答頁。
- 公開頁面已移除「夥伴測試版／測試預覽／非正式量表」及整段「答案怎麼處理」；首頁、作答頁、結果頁與公開 JavaScript 掃描無殘留字樣。
- 正式站以 390×844px 完整走完 18 題，自動換題、六面向雷達圖、三項工具與重新檢測皆正常；重新檢測後回到第 1 題且沒有保留選項。
- 未計分選項已精簡為唯一的「我沒有遇過這個狀況」；`uncertain` 不再是有效答案。正式站以滑鼠選取會直接進入下一題，鍵盤式選取後可按下一題。
- 瀏覽器 console 無 error 或 warning。
- 雷達圖後、工具推薦前已加入「整體樣貌」與「接下來可以」；只有既有工具規則選出單一面向時才點名同一面向，並顯示一項對應行動。
- 正式站以 390×844px 驗證金錢掌握明確較少出現案例：摘要、單一步驟與首張「記帳助理」一致，頁面無水平溢出；一題選「我沒有遇過這個狀況」時不點名面向、不出現 featured card。
- 正式站重新檢測後回到第 1 題、0 個選項被選取且下一題 disabled；console 無 error 或 warning。
- 結果主標題改為「我的財務處理」；摘要改為「從你的選擇，整理平常的做法」，內含「你目前的做法」與「可以先試試」。
- 摘要 v0.2 只觀察填答選項，不再使用圖形、位置、起伏、差距或放大面向等雷達分析語言；「我沒有遇過」的情況以「這很正常」承接，不替未遇過的事情下結論。
- 正式站 390×844px 完整走完 18 題：金錢掌握案例顯示溫暖觀察、對應小步驟與首張「記帳助理」，無水平溢出且 console 無 error 或 warning。

## 發布歷程

- 2026-09-16 12:35：初次正式預覽部署 `dpl_Fd5JN3JTRexs6uDsUNVJmcW9a3pd`。
- 2026-09-16 14:45：部署 v0.2 推薦規則與文案更新 `dpl_F9qkUMxc6wzrwqVbThPZNuyH4onu`。
- 2026-09-16 15:34：部署 v0.3 去 AI 化文案、雙原因未計分選項與常駐雷達缺答機制 `dpl_9UBmX47ydYSi3myPRkdJ26dKWGVw`。
- 2026-09-16 15:47：部署 v0.4 第 2 題固定支出預留文案 `dpl_Guoqwkh9wNRtB1AojLCVoWKvECQF`。
- 2026-09-16 16:37：部署 v0.5 第 5 題非必要支出文案 `dpl_6Jvd5isZVjr8P4H2Vqkof18cnF7t`。
- 2026-09-16 16:46：部署 v0.6 平常做法框架與首頁文案修正 `dpl_CbGPxWUAEE7Vs1oeDj65twdMLkqH`。
- 2026-09-16 17:01：部署正式問卷介面文案，移除答案處理與測試版敘述，並將夥伴計分頁排除於公開部署 `dpl_86FfDGCq1WXeziPvrzPxM583U1zT`。
- 2026-09-16 17:16：部署 v0.7 單一未計分選項「我沒有遇過這個狀況」，移除「不確定怎麼回答」及其答案值 `dpl_2MxLhvtgiKyExM91Sim4ydLWQhz3`。
- 2026-09-16 17:37：部署結果摘要 v0.1，在雷達圖下方新增整體樣貌與一項行動建議，並沿用既有工具分流邏輯 `dpl_8Fj11RzfZ27tmjG7C2sJM9BrMao8`。
- 2026-09-16 17:56：部署結果摘要 v0.2，主標題改為「我的財務處理」，摘要改從填答選項做溫暖觀察，不再分析雷達圖 `dpl_2Ya84oXT69SkcdhbmnAsosJkCbwW`。
