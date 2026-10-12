// Generated from the reviewed 1+4 assessment sources. Do not expose option.value in the UI.
export const APP_VERSION = 'decision-awareness-1plus4-v1.0';
export const ATTEMPT_VERSION = 10;
export const STORAGE_KEY = 'familyfin.decision-awareness.v10.transfer';
export const NOT_ENCOUNTERED = 'not_encountered';
export const TOOLS = {
  "accounting": {
    "name": "記帳助理",
    "description": "先記一筆實際收支，逐步看清日常金錢流向。",
    "href": "https://www.familyfinhealth.com/toolbox/accounting",
    "action": "開始記一筆"
  },
  "monthlyReport": {
    "name": "財務月報表",
    "description": "把收入、支出、資產與負債放在一起，看見目前能運用的空間。",
    "href": "https://www.familyfinhealth.com/toolbox/monthly-report",
    "action": "整理本月輪廓"
  },
  "healthDashboard": {
    "name": "財務健康儀表板",
    "description": "從收支、預備金、負債與保障等條件，盤點目前的生活底盤。",
    "href": "https://www.familyfinhealth.com/toolbox/financial-health-dashboard",
    "action": "開始八項盤點"
  },
  "planningTool": {
    "name": "生活目標財務規劃",
    "description": "選一件想完成的事，把時間、金額與每月可準備的步驟放在一起。",
    "href": "https://www.familyfinhealth.com/toolbox/planning",
    "action": "規劃一件事"
  },
  "savingsQuick": {
    "name": "儲蓄目標試算",
    "description": "用概略金額試算準備時間，看看目標可以怎麼累積。",
    "href": "https://www.familyfinhealth.com/toolbox/planning/quick",
    "action": "試算一個目標"
  },
  "timeResources": {
    "name": "時間資源盤點助理",
    "description": "除了錢，也整理目前能運用的時間、能力與生活資源。",
    "href": "https://www.familyfinhealth.com/toolbox/time-resource-inventory",
    "action": "盤點可用資源"
  },
  "timeline": {
    "name": "生命歷程整理",
    "description": "從一件重要事件開始，整理人物、時間與生活變化。",
    "href": "https://www.familyfinhealth.com/toolbox/case-timeline",
    "action": "整理一個片段"
  },
  "resilience": {
    "name": "財務韌性檢測",
    "description": "看看生活遇到變動時，目前有哪些承接與調整空間。",
    "href": "https://www.familyfinhealth.com/financial-resilience",
    "action": "看看財務韌性"
  },
  "financialFit": {
    "name": "財務合拍檢測",
    "description": "如果彼此都願意，可以各自作答後再交換對金錢的想法。",
    "href": "https://www.familyfinhealth.com/financial-fit",
    "action": "了解雙人檢測"
  },
  "financialAnxiety": {
    "name": "財務焦慮檢測",
    "description": "看見金錢壓力如何影響感受與日常反應。",
    "href": "https://www.familyfinhealth.com/financial-anxiety",
    "action": "看看壓力的影響"
  }
};
export const ASSESSMENTS = {
  "entry": {
    "id": "entry",
    "kind": "entry_tendency",
    "eyebrow": "入口探索",
    "title": "做金錢決定時，我通常先在意什麼？",
    "shortTitle": "我的金錢決定",
    "description": "從生活中的用錢選擇，看見自己做決定時較常先放在心裡的事。",
    "duration": "約 2 分鐘",
    "minimumValid": 6,
    "questions": [
      {
        "id": "entry-1",
        "title": "多出一筆可以安排的錢",
        "scenario": "這個月多出一筆可以自己安排的 3,000 元。",
        "prompt": "你最可能先怎麼做？",
        "options": [
          {
            "id": "entry-1-a",
            "label": "A",
            "text": "先留起來，讓生活臨時有需要時還有空間。",
            "value": "security"
          },
          {
            "id": "entry-1-b",
            "label": "B",
            "text": "拿一部分改善現在的生活，或做一件期待已久的事。",
            "value": "present"
          },
          {
            "id": "entry-1-c",
            "label": "C",
            "text": "先想到家人或重要的人最近有沒有共同需要。",
            "value": "relationship"
          },
          {
            "id": "entry-1-d",
            "label": "D",
            "text": "用在一個想完成的目標，讓最近的努力有明確成果。",
            "value": "achievement"
          }
        ]
      },
      {
        "id": "entry-2",
        "title": "需要馬上決定的機會",
        "scenario": "你看到一門可能對工作或生活有幫助的課程，但優惠今晚截止。",
        "prompt": "你最可能怎麼決定？",
        "options": [
          {
            "id": "entry-2-a",
            "label": "A",
            "text": "先看它能不能讓重要目標往前走，再決定是否投入。",
            "value": "achievement"
          },
          {
            "id": "entry-2-b",
            "label": "B",
            "text": "先從短期或入門方案試試看，不一次投入太多。",
            "value": "action"
          },
          {
            "id": "entry-2-c",
            "label": "C",
            "text": "比較內容、總費用與其他選擇，再做決定。",
            "value": "planning"
          },
          {
            "id": "entry-2-d",
            "label": "D",
            "text": "選擇可以退改或調整的方案，替之後保留空間。",
            "value": "adaptive"
          }
        ]
      },
      {
        "id": "entry-3",
        "title": "重要的人臨時需要幫忙",
        "scenario": "家人或重要的人臨時開口，希望你幫忙一筆超出平常往來的錢。",
        "prompt": "你最可能先怎麼做？",
        "options": [
          {
            "id": "entry-3-a",
            "label": "A",
            "text": "先了解對方真正需要什麼，再一起談可以怎麼處理。",
            "value": "relationship"
          },
          {
            "id": "entry-3-b",
            "label": "B",
            "text": "先確認不影響自己的基本生活，再說能幫多少。",
            "value": "security"
          },
          {
            "id": "entry-3-c",
            "label": "C",
            "text": "除了直接給錢，也一起找分期、資源或其他做法。",
            "value": "adaptive"
          },
          {
            "id": "entry-3-d",
            "label": "D",
            "text": "先請對方給我一點時間，等自己比較能面對時再回覆。",
            "value": "pause"
          }
        ]
      },
      {
        "id": "entry-4",
        "title": "突然出現的費用",
        "scenario": "家裡的電器、交通工具或醫療突然需要一筆原本沒有安排的費用。你最可能先怎麼處理？",
        "prompt": "選一個最接近你第一個反應的做法。",
        "options": [
          {
            "id": "entry-4-a",
            "label": "A",
            "text": "先處理最急的一小部分，讓事情不要繼續擴大。",
            "value": "action"
          },
          {
            "id": "entry-4-b",
            "label": "B",
            "text": "先確認金額、期限與不同做法的總負擔。",
            "value": "planning"
          },
          {
            "id": "entry-4-c",
            "label": "C",
            "text": "先讓自己緩一下，等比較有空間時再回來整理。",
            "value": "pause"
          },
          {
            "id": "entry-4-d",
            "label": "D",
            "text": "先把必要生活費留好，再調整其他安排。",
            "value": "security"
          }
        ]
      },
      {
        "id": "entry-5",
        "title": "想買東西獎勵自己",
        "scenario": "完成一件辛苦很久的事情後，你想買一樣不是現在一定需要的東西。你最可能怎麼想？",
        "prompt": "選一個最接近你第一個反應的做法。",
        "options": [
          {
            "id": "entry-5-a",
            "label": "A",
            "text": "先比較價格、使用頻率與買下後對其他支出的影響。",
            "value": "planning"
          },
          {
            "id": "entry-5-b",
            "label": "B",
            "text": "如果它能代表這段努力的成果，我會先訂預算再選擇。",
            "value": "achievement"
          },
          {
            "id": "entry-5-c",
            "label": "C",
            "text": "如果它能讓現在的生活舒服一點，我會在負擔得起時買下。",
            "value": "present"
          },
          {
            "id": "entry-5-d",
            "label": "D",
            "text": "先用租借、試用或小額版本，確認適合再投入。",
            "value": "action"
          }
        ]
      },
      {
        "id": "entry-6",
        "title": "需要一起出錢的計畫",
        "scenario": "你和家人或重要的人正討論一個需要一起出錢的計畫，例如旅行、搬家或添購家用品。",
        "prompt": "你最可能先在意什麼？",
        "options": [
          {
            "id": "entry-6-a",
            "label": "A",
            "text": "這個安排能不能讓大家現在的生活多一點好的感受。",
            "value": "present"
          },
          {
            "id": "entry-6-b",
            "label": "B",
            "text": "預算能不能保留調整空間，遇到變化時還改得動。",
            "value": "adaptive"
          },
          {
            "id": "entry-6-c",
            "label": "C",
            "text": "這個計畫能不能成為大家一起完成的重要里程碑。",
            "value": "achievement"
          },
          {
            "id": "entry-6-d",
            "label": "D",
            "text": "每個人的期待、負擔與可以接受的範圍有沒有說清楚。",
            "value": "relationship"
          }
        ]
      },
      {
        "id": "entry-7",
        "title": "好幾件要用錢的事一起出現",
        "scenario": "帳單、生活安排和一個想完成的目標同時需要你處理。",
        "prompt": "你最可能從哪裡開始？",
        "options": [
          {
            "id": "entry-7-a",
            "label": "A",
            "text": "先看哪些事情能移動，再依當下狀況重新排序。",
            "value": "adaptive"
          },
          {
            "id": "entry-7-b",
            "label": "B",
            "text": "先放一下，等壓力沒有那麼大時再回來看。",
            "value": "pause"
          },
          {
            "id": "entry-7-c",
            "label": "C",
            "text": "先完成一件今天做得到的小事，讓整理開始動起來。",
            "value": "action"
          },
          {
            "id": "entry-7-d",
            "label": "D",
            "text": "先把金額、期限與優先順序列清楚。",
            "value": "planning"
          }
        ]
      },
      {
        "id": "entry-8",
        "title": "接下來的收入可能變少",
        "scenario": "你得知接下來一段時間的收入可能變少，原本的支出安排需要調整。",
        "prompt": "你最可能先怎麼做？",
        "options": [
          {
            "id": "entry-8-a",
            "label": "A",
            "text": "先不急著看全部，等自己比較能面對時再整理。",
            "value": "pause"
          },
          {
            "id": "entry-8-b",
            "label": "B",
            "text": "先和可能受到影響的人說明，再一起調整安排。",
            "value": "relationship"
          },
          {
            "id": "entry-8-c",
            "label": "C",
            "text": "先保留基本生活與不能延後的支出。",
            "value": "security"
          },
          {
            "id": "entry-8-d",
            "label": "D",
            "text": "即使要縮減，也保留一項能維持生活感受的小支出。",
            "value": "present"
          }
        ]
      }
    ],
    "profiles": {
      "security": {
        "key": "security",
        "typeName": "安全規劃型",
        "name": "重視安心與準備",
        "meaning": "做決定前，會先確認基本生活與預留空間。",
        "help": "這能先顧住基本生活與意外變化，讓決定多一點安心。",
        "watch": "也可以留意：想把風險都準備好時，是否讓原本可以調整的選擇一起停下來。",
        "nextAssessment": "plan",
        "followupQuestion": "計畫遇到變化時，你還能繼續做下去嗎？"
      },
      "present": {
        "key": "present",
        "typeName": "當下滿足型",
        "name": "重視當下需要",
        "meaning": "會把眼前生活感受與現在真正需要的事情放進考量。",
        "help": "這能讓金錢回應當下真正的生活需要，不只剩下數字。",
        "watch": "也可以留意：照顧現在之後，有沒有替接下來不能延後的支出留下位置。",
        "nextAssessment": "pressure",
        "followupQuestion": "哪些花費真的在照顧自己，哪些比較像短暫紓壓？"
      },
      "planning": {
        "key": "planning",
        "typeName": "精算判斷型",
        "name": "先比較再決定",
        "meaning": "會先看清金額、條件、順序與後續影響。",
        "help": "這能幫你看清條件與後續影響，減少倉促決定。",
        "watch": "也可以留意：資料還沒完全齊全時，是否仍有一個可以先做的小步驟。",
        "nextAssessment": "plan",
        "followupQuestion": "想得很清楚之後，計畫通常走得下去嗎？"
      },
      "action": {
        "key": "action",
        "typeName": "行動嘗試型",
        "name": "願意先試再調整",
        "meaning": "願意先做一個負擔得起的小嘗試，再依結果調整。",
        "help": "這能降低開始的門檻，從實際經驗中慢慢調整。",
        "watch": "也可以留意：開始以前，是否看過可用金額與之後要承擔的部分。",
        "nextAssessment": "clarity",
        "followupQuestion": "開始以前，你掌握可用金額與後續負擔嗎？"
      },
      "relationship": {
        "key": "relationship",
        "typeName": "關係照顧型",
        "name": "會先顧到重要的人",
        "meaning": "會把家人、重要的人與共同生活放進決定。",
        "help": "這能把共同生活與重要關係放進決定，不讓金錢只剩個人的計算。",
        "watch": "也可以留意：照顧別人時，自己的基本生活與能負擔的界線有沒有一起被看見。",
        "nextAssessment": "family",
        "followupQuestion": "照顧重要的人時，你也清楚自己能負擔到哪裡嗎？"
      },
      "achievement": {
        "key": "achievement",
        "typeName": "成就證明型",
        "name": "希望努力有看得見的成果",
        "meaning": "希望金錢選擇能支持目標，也讓努力有被看見的成果。",
        "help": "這能讓金錢支持目標，也讓長期努力有看得見的成果。",
        "watch": "也可以留意：想證明努力值得時，這筆花費是否仍符合現在的生活空間。",
        "nextAssessment": "pressure",
        "followupQuestion": "想讓努力有成果時，花錢會不會也成為獎勵或壓力出口？"
      },
      "adaptive": {
        "key": "adaptive",
        "typeName": "彈性應變型",
        "name": "先保留調整空間",
        "meaning": "會保留選擇空間，遇到變化時再重新安排。",
        "help": "這能保留選擇空間，生活出現變化時不必被原本計畫綁住。",
        "watch": "也可以留意：每次調整之後，自己是否仍知道錢去了哪裡、還剩下多少。",
        "nextAssessment": "clarity",
        "followupQuestion": "調整安排後，你仍知道錢去了哪裡、還剩多少嗎？"
      },
      "pause": {
        "key": "pause",
        "typeName": "延後面對型",
        "name": "會先留點空間再處理",
        "meaning": "壓力變大時，可能先暫緩，等比較能面對時再回來處理。",
        "help": "這能在壓力太大時替自己留一點喘息，不必勉強立刻做完所有決定。",
        "watch": "也可以留意：暫停之後，是否留下一個容易回來的時間或最小步驟。",
        "nextAssessment": "clarity",
        "followupQuestion": "如果只先看一小部分，你最願意從哪項資訊開始？"
      }
    }
  },
  "clarity": {
    "id": "clarity",
    "kind": "mean_state",
    "eyebrow": "主題探索",
    "title": "我看得懂自己的錢嗎？",
    "shortTitle": "我看得懂自己的錢嗎",
    "description": "看見自己做金錢決定前，通常掌握哪些資訊，以及哪些部分會等需要時再確認。",
    "awarenessFocus": "我做決定時，是先把資訊放在一起、先抓大方向，還是多半依當下看得到的金額處理？",
    "duration": "約 2 分鐘",
    "minimumValid": 5,
    "questions": [
      {
        "id": "clarity-1",
        "title": "安排這個月的收入",
        "scenario": "收入陸續入帳後，你準備安排接下來一個月的生活。",
        "prompt": "你通常會先怎麼抓這個月可以使用的收入？",
        "options": [
          {
            "id": "clarity-1-a",
            "label": "A",
            "text": "我會分開整理已入帳與確定會入帳的款項，再抓可用總額。",
            "value": 3
          },
          {
            "id": "clarity-1-b",
            "label": "B",
            "text": "我會先抓主要收入和大致範圍，其他款項入帳後再補進來。",
            "value": 2
          },
          {
            "id": "clarity-1-c",
            "label": "C",
            "text": "我會看帳戶目前的餘額，再憑經驗抓一個大概。",
            "value": 1
          },
          {
            "id": "clarity-1-d",
            "label": "D",
            "text": "我通常到要用錢時，才確認當下還有多少。",
            "value": 0
          }
        ]
      },
      {
        "id": "clarity-2",
        "title": "找出這個月花得比較快的原因",
        "scenario": "這個月覺得錢花得比平常快，你想知道差別出在哪裡。",
        "prompt": "你比較可能先做什麼？",
        "options": [
          {
            "id": "clarity-2-a",
            "label": "A",
            "text": "我會先回想幾筆比較大的花費，抓出最可能的原因。",
            "value": 1
          },
          {
            "id": "clarity-2-b",
            "label": "B",
            "text": "我會對照記帳、帳戶與信用卡紀錄，看看各類支出的變化。",
            "value": 3
          },
          {
            "id": "clarity-2-c",
            "label": "C",
            "text": "我會先縮減接下來的花費，之後有需要再回頭整理。",
            "value": 0
          },
          {
            "id": "clarity-2-d",
            "label": "D",
            "text": "我會查看帳戶與信用卡紀錄，先找出幾項主要支出。",
            "value": 2
          }
        ]
      },
      {
        "id": "clarity-3",
        "title": "替固定支出保留空間",
        "scenario": "新月份開始，房租、水電、電信、保險或其他固定支出陸續要支付。",
        "prompt": "你通常怎麼準備？",
        "options": [
          {
            "id": "clarity-3-a",
            "label": "A",
            "text": "我知道主要項目與大概金額，會先留一筆錢。",
            "value": 2
          },
          {
            "id": "clarity-3-b",
            "label": "B",
            "text": "我會等扣款或繳費通知出現，再安排這筆支出。",
            "value": 0
          },
          {
            "id": "clarity-3-c",
            "label": "C",
            "text": "我了解每項固定支出與付款時間，會事先預留好。",
            "value": 3
          },
          {
            "id": "clarity-3-d",
            "label": "D",
            "text": "我會先處理最確定的幾筆，其他項目到期時再看。",
            "value": 1
          }
        ]
      },
      {
        "id": "clarity-4",
        "title": "確認還款會不會影響生活",
        "scenario": "你要安排信用卡分期、信貸、房貸、親友借款等還款與生活支出。",
        "prompt": "哪個情況比較接近你現在的做法？",
        "options": [
          {
            "id": "clarity-4-a",
            "label": "A",
            "text": "我知道每筆餘額、每月付款與剩餘期限。",
            "value": 3
          },
          {
            "id": "clarity-4-b",
            "label": "B",
            "text": "我知道每月合計大約要付多少，也掌握幾筆主要款項。",
            "value": 2
          },
          {
            "id": "clarity-4-c",
            "label": "C",
            "text": "我通常看這一期帳單，先確認這次合計要付多少。",
            "value": 1
          },
          {
            "id": "clarity-4-d",
            "label": "D",
            "text": "我多半等帳單或提醒出現，才確認要處理多少。",
            "value": 0
          }
        ]
      },
      {
        "id": "clarity-5",
        "title": "想買一樣東西前，先看能不能負擔",
        "scenario": "生活必要支出都要顧，這週也想安排一頓聚餐或買一樣想要的東西。",
        "prompt": "你通常怎麼判斷這筆錢能不能用？",
        "options": [
          {
            "id": "clarity-5-a",
            "label": "A",
            "text": "我會看帳戶餘額，留下一筆生活費後再決定。",
            "value": 1
          },
          {
            "id": "clarity-5-b",
            "label": "B",
            "text": "我會先決定要不要花，再調整後面的其他支出。",
            "value": 0
          },
          {
            "id": "clarity-5-c",
            "label": "C",
            "text": "我會扣掉已知的固定與近期必要支出，再抓可以使用的金額。",
            "value": 2
          },
          {
            "id": "clarity-5-d",
            "label": "D",
            "text": "我會把必要支出、預留款和近期可能支出一起算進去再決定。",
            "value": 3
          }
        ]
      },
      {
        "id": "clarity-6",
        "title": "替幾個月後的大筆支出準備",
        "scenario": "幾個月後可能有保費、學費、過年、旅行或家電更換等較大的支出。",
        "prompt": "你通常怎麼把它放進現在的安排？",
        "options": [
          {
            "id": "clarity-6-a",
            "label": "A",
            "text": "我會等時間接近或確定要付時，再安排怎麼處理。",
            "value": 0
          },
          {
            "id": "clarity-6-b",
            "label": "B",
            "text": "我會先估金額與時間，分月預留或安排來源。",
            "value": 3
          },
          {
            "id": "clarity-6-c",
            "label": "C",
            "text": "我心裡知道可能會發生，有餘裕時會先留一些。",
            "value": 1
          },
          {
            "id": "clarity-6-d",
            "label": "D",
            "text": "我會先放進接下來幾個月的大致安排，再視情況調整。",
            "value": 2
          }
        ]
      }
    ],
    "profiles": {
      "map": {
        "code": "map",
        "name": "做決定前，通常已掌握主要資訊",
        "path": "遇到支出或目標選擇時，你較常先把可用收入、固定責任與近期變化放在一起，再決定能調整多少。這能減少遺漏；若一直等到資訊非常完整，也可能讓行動晚一點開始。",
        "action": "先把可用收入、固定責任與近期變化放在一起看。",
        "help": "減少遺漏，也比較知道這次能調整多少。",
        "watch": "如果一直等到資訊很完整，行動可能會晚一點開始。",
        "step": "先記下目前可用收入、固定支出、預留金與還款狀況；不知道的項目先留白。",
        "bridge": "把已知資料填入儀表板，檢視收支、預備金與負債；留白處就是下一步要補的資訊。",
        "primaryTool": "healthDashboard",
        "otherTools": [
          "planningTool",
          "savingsQuick"
        ]
      },
      "outline": {
        "code": "outline",
        "name": "先掌握大方向，需要時再補細節",
        "path": "你通常先抓住主要收入、固定支出或大筆款項，再依眼前決定補查細節。這讓日常安排比較有效率；當多筆變化一起出現時，資訊可能需要重新拼在一起。",
        "action": "先抓住主要收入、固定支出與大筆款項。",
        "help": "讓日常安排維持簡單，也能快速掌握大方向。",
        "watch": "多筆變化一起出現時，資料可能需要重新整理。",
        "step": "把這個月三項最大或最固定的支出寫在同一處，確認它們之後還有多少可調整空間。",
        "bridge": "以這三項支出為起點，再補上收入、資產與負債，完成本月輪廓。",
        "primaryTool": "monthlyReport",
        "otherTools": [
          "healthDashboard",
          "planningTool"
        ]
      },
      "on_demand": {
        "code": "on_demand",
        "name": "需要時再回頭確認",
        "path": "你多半先處理眼前需要，再從餘額、帳單或記憶中補資訊。這能保留應變速度；如果資料散在不同地方，同一件事可能需要反覆確認。",
        "action": "先處理眼前需要，需要時再補查資料。",
        "help": "保留應變速度，不必每次都先整理完整帳目。",
        "watch": "資料散在不同地方時，同一件事可能要反覆確認。",
        "step": "找出最近一筆收入或支出，記下日期、項目與金額。",
        "bridge": "把這一筆輸入記帳助理，作為固定記錄位置的第一筆資料。",
        "primaryTool": "accounting",
        "otherTools": [
          "monthlyReport",
          "healthDashboard"
        ]
      },
      "current": {
        "code": "current",
        "name": "目前多從眼前的金額開始判斷",
        "path": "目前不少決定會從帳戶餘額、到期提醒或眼前支出開始。這讓你先顧到最迫切的事情；較晚出現的固定責任或未來支出，可能比較難一起被看見。",
        "action": "從帳戶餘額、到期提醒或眼前支出開始。",
        "help": "先顧到現在最迫切的事情。",
        "watch": "較晚出現的固定責任與未來支出，可能不容易一起被看見。",
        "step": "先找出最近三筆支出，記下日期、項目與金額。",
        "bridge": "先輸入這三筆，再從後續記錄看見金錢流向，不必一次整理全部。",
        "primaryTool": "accounting",
        "otherTools": [
          "monthlyReport"
        ]
      }
    },
    "fallbackTool": "monthlyReport",
    "safetyNote": ""
  },
  "pressure": {
    "id": "pressure",
    "kind": "dominant_pattern",
    "eyebrow": "主題探索",
    "title": "壓力來時，我會怎麼用錢？",
    "shortTitle": "壓力來時，我會怎麼用錢",
    "description": "看見壓力剛出現時，自己最先想保護的是什麼，以及第一個金錢反應。",
    "awarenessFocus": "壓力出現時，我會先讓自己喘口氣、先拉開距離、先收緊支出、先照顧重要的人，還是先停一下整理？",
    "duration": "約 2 分鐘",
    "minimumValid": 5,
    "questions": [
      {
        "id": "pressure-1",
        "title": "臨時支出打亂原本安排",
        "scenario": "這個月突然多了一筆修理或醫療支出，原本安排好的花費得跟著調整。",
        "prompt": "你最可能先做什麼？",
        "options": [
          {
            "id": "pressure-1-a",
            "label": "A",
            "text": "我會先看金額、期限和手邊資源，停一下再決定怎麼調整。",
            "value": "P1"
          },
          {
            "id": "pressure-1-b",
            "label": "B",
            "text": "我會先安排一筆讓自己放鬆的小花費，等心情緩下來再處理。",
            "value": "P2"
          },
          {
            "id": "pressure-1-c",
            "label": "C",
            "text": "我會先把明細或通知放著，等比較有力氣時再看。",
            "value": "P3"
          },
          {
            "id": "pressure-1-d",
            "label": "D",
            "text": "我會先把接下來可以減少的支出都停下來。",
            "value": "P4"
          },
          {
            "id": "pressure-1-e",
            "label": "E",
            "text": "我會先顧住自己或家人眼前最在意的需要，其他費用晚點再想。",
            "value": "P5"
          }
        ]
      },
      {
        "id": "pressure-2",
        "title": "很累時遇到想買的東西",
        "scenario": "忙了一整天，心情很累，剛好看到一個很想買的東西或想吃的餐點。",
        "prompt": "你比較可能先怎麼做？",
        "options": [
          {
            "id": "pressure-2-a",
            "label": "A",
            "text": "我會直接買下來或吃想吃的，先讓今天好過一點。",
            "value": "P2"
          },
          {
            "id": "pressure-2-b",
            "label": "B",
            "text": "我暫時不想做決定，也不想看帳戶，先讓這件事擺著。",
            "value": "P3"
          },
          {
            "id": "pressure-2-c",
            "label": "C",
            "text": "我會告訴自己現在什麼都不能花，即使原本有預算也先取消。",
            "value": "P4"
          },
          {
            "id": "pressure-2-d",
            "label": "D",
            "text": "我會買一份給自己或重要的人，用這筆花費表達「今天辛苦了」。",
            "value": "P5"
          },
          {
            "id": "pressure-2-e",
            "label": "E",
            "text": "我會先離開頁面或現場，晚一點再看自己還想不想要。",
            "value": "P1"
          }
        ]
      },
      {
        "id": "pressure-3",
        "title": "帳單比預期多",
        "scenario": "帳單金額比預期多，眼前還有其他事情要處理。",
        "prompt": "你最可能先做什麼？",
        "options": [
          {
            "id": "pressure-3-a",
            "label": "A",
            "text": "我會先不打開明細，也先不回相關訊息。",
            "value": "P3"
          },
          {
            "id": "pressure-3-b",
            "label": "B",
            "text": "我會立刻把接下來能減少的支出縮到最低。",
            "value": "P4"
          },
          {
            "id": "pressure-3-c",
            "label": "C",
            "text": "我會先確保家人或重要的人原本的安排不受影響，自己的部分再調整。",
            "value": "P5"
          },
          {
            "id": "pressure-3-d",
            "label": "D",
            "text": "我會先確認明細和繳款時間，排出可以處理的順序。",
            "value": "P1"
          },
          {
            "id": "pressure-3-e",
            "label": "E",
            "text": "我會先用一筆小花費讓自己緩一下，再回來面對。",
            "value": "P2"
          }
        ]
      },
      {
        "id": "pressure-4",
        "title": "重要的人臨時需要金錢協助",
        "scenario": "家人或重要的人臨時開口需要金錢協助，但你自己的預算也不寬鬆。",
        "prompt": "你最可能先怎麼回應？",
        "options": [
          {
            "id": "pressure-4-a",
            "label": "A",
            "text": "我會先把自己的可調整支出壓到最低，再看能挪出多少。",
            "value": "P4"
          },
          {
            "id": "pressure-4-b",
            "label": "B",
            "text": "我會先答應一部分或先代墊，讓對方不用那麼擔心。",
            "value": "P5"
          },
          {
            "id": "pressure-4-c",
            "label": "C",
            "text": "我會先問清楚需要、時間與其他方法，再決定自己能負擔多少。",
            "value": "P1"
          },
          {
            "id": "pressure-4-d",
            "label": "D",
            "text": "我會先用一頓飯或一筆小花費緩和情緒，細節之後再談。",
            "value": "P2"
          },
          {
            "id": "pressure-4-e",
            "label": "E",
            "text": "我會先不給明確答覆，希望事情過幾天再說。",
            "value": "P3"
          }
        ]
      },
      {
        "id": "pressure-5",
        "title": "原本的安排連續幾次沒做到",
        "scenario": "原本的存錢或還款安排連續兩次沒有做到。",
        "prompt": "接下來你比較可能怎麼做？",
        "options": [
          {
            "id": "pressure-5-a",
            "label": "A",
            "text": "我會覺得最近大家都很辛苦，先讓自己或家人舒服一點。",
            "value": "P5"
          },
          {
            "id": "pressure-5-b",
            "label": "B",
            "text": "我會看看哪裡被打亂，把下一步縮小後重新開始。",
            "value": "P1"
          },
          {
            "id": "pressure-5-c",
            "label": "C",
            "text": "我會先安排一筆讓自己開心的花費，等挫折感過去再回來。",
            "value": "P2"
          },
          {
            "id": "pressure-5-d",
            "label": "D",
            "text": "我會先不看進度，過一陣子有心情再說。",
            "value": "P3"
          },
          {
            "id": "pressure-5-e",
            "label": "E",
            "text": "我會把新的規則訂得更嚴，暫時不讓自己有額外花費。",
            "value": "P4"
          }
        ]
      },
      {
        "id": "pressure-6",
        "title": "看到限時優惠時",
        "scenario": "看到限時優惠，心裡擔心現在不買就錯過，但這筆錢不在原本安排裡。",
        "prompt": "你最可能先怎麼做？",
        "options": [
          {
            "id": "pressure-6-a",
            "label": "A",
            "text": "我不只先不買，接下來一段時間的非必要支出也全部停止。",
            "value": "P4"
          },
          {
            "id": "pressure-6-b",
            "label": "B",
            "text": "我會先離開結帳頁，確認手邊資源與真正需要後再決定。",
            "value": "P1"
          },
          {
            "id": "pressure-6-c",
            "label": "C",
            "text": "如果能讓自己或重要的人開心，我會覺得值得先買。",
            "value": "P5"
          },
          {
            "id": "pressure-6-d",
            "label": "D",
            "text": "我會把頁面關掉，也先不去看這個月還剩多少錢。",
            "value": "P3"
          },
          {
            "id": "pressure-6-e",
            "label": "E",
            "text": "我會先買再說，讓自己享受一下當下。",
            "value": "P2"
          }
        ]
      }
    ],
    "profiles": {
      "P1": {
        "code": "P1",
        "name": "先停一下，把事情看清楚",
        "path": "壓力出現時，你較常先確認金額、期限與手邊資源，再決定怎麼處理。這能減少倉促決定；若一直停在整理，也可能讓第一步延後。",
        "action": "先確認金額、期限與手邊資源。",
        "help": "減少倉促決定，讓事情有次序。",
        "watch": "如果一直停在整理，第一步可能會延後。",
        "step": "記下這筆臨時支出的金額、期限，以及本月不能挪動的三項支出。",
        "bridge": "把這些資料放進財務月報表，查看本月還有哪些項目可以調整。",
        "primaryTool": "monthlyReport",
        "otherTools": [
          "healthDashboard",
          "planningTool"
        ]
      },
      "P2": {
        "code": "P2",
        "name": "先讓自己喘口氣",
        "path": "壓力高的時候，你較常先用一筆花費換回放鬆或安慰，再處理原本的事情。這能幫自己撐過當下；有時也會讓壓力往後移。",
        "action": "先用一筆花費讓自己放鬆或得到安慰。",
        "help": "在壓力高的時候，先讓自己有力氣撐過當下。",
        "watch": "原本的壓力與後續支出，有時會一起往後移。",
        "step": "找出最近一筆紓壓花費，記下日期、項目、金額，以及當時想照顧的感受。",
        "bridge": "把這筆花費記入記帳助理，之後可回看哪些支出真的帶來休息。",
        "primaryTool": "accounting",
        "otherTools": [
          "financialAnxiety",
          "timeline"
        ]
      },
      "P3": {
        "code": "P3",
        "name": "壓力太大時，先晚一點處理",
        "path": "資訊或情緒一下子太多時，你較常先不看、不回覆或晚點再處理。這能避免自己立刻被壓垮；帳單與期限也可能一起被放下。",
        "action": "先不看、不回覆，晚一點再處理。",
        "help": "避免一下子被太多資訊或情緒壓住。",
        "watch": "帳單與期限也可能一起被放下。",
        "step": "只打開一項通知，記下金額、期限與這個月可用的收入。",
        "bridge": "先把這三項放進財務月報表，看見它和本月其他收支的關係。",
        "primaryTool": "monthlyReport",
        "otherTools": [
          "accounting",
          "financialAnxiety"
        ]
      },
      "P4": {
        "code": "P4",
        "name": "先把支出收緊",
        "path": "壓力出現時，你較常先減少支出，快速找回掌控感。這在短期內很直接；若規則過緊，也可能讓生活難以維持。",
        "action": "先減少支出，快速把金錢收緊。",
        "help": "短期內找回掌控感。",
        "watch": "規則過緊時，生活需要也可能難以維持。",
        "step": "列出本月準備縮減的支出，分成「可暫停」與「生活仍需要」，並寫下大概金額。",
        "bridge": "把分類後的金額放進財務月報表，確認縮減後仍能維持基本生活。",
        "primaryTool": "monthlyReport",
        "otherTools": [
          "planningTool",
          "healthDashboard"
        ]
      },
      "P5": {
        "code": "P5",
        "name": "先照顧自己或重要的人",
        "path": "壓力出現時，你較常先用金錢顧住感受、關係或眼前需要。這能快速傳達支持；自己的資源與後續安排有時會較晚被看見。",
        "action": "先用金錢照顧感受、關係或眼前需要。",
        "help": "快速傳達支持，先顧住重要的人與事。",
        "watch": "自己的資源與後續安排，可能比較晚被看見。",
        "step": "寫下想照顧的需要，再列一項可用的時間、能力或陪伴，以及金錢底線。",
        "bridge": "把非金錢資源放進時間資源盤點助理，看看除了花錢還有哪些支持方式。",
        "primaryTool": "timeResources",
        "otherTools": [
          "planningTool",
          "financialFit"
        ]
      }
    },
    "fallbackTool": "accounting",
    "safetyNote": ""
  },
  "family": {
    "id": "family",
    "kind": "dominant_pattern",
    "eyebrow": "主題探索",
    "title": "我和家人的金錢界線清楚嗎？",
    "shortTitle": "我和家人的金錢界線清楚嗎",
    "description": "看見面對共同支出或家人需要時，自己如何衡量關係、責任、能力與決定權。",
    "awarenessFocus": "當家裡需要做金錢決定時，我會先協商、先承擔、先退讓、先分清責任，還是先依既有方式處理？",
    "duration": "約 2 分鐘",
    "minimumValid": 5,
    "questions": [
      {
        "id": "family-1",
        "title": "家裡突然多一筆必要支出",
        "scenario": "家裡突然多了一筆必要支出。",
        "prompt": "你比較可能怎麼處理？",
        "options": [
          {
            "id": "family-1-a",
            "label": "A",
            "text": "我會先和相關的人確認需要多少、各自能負擔多少，再決定怎麼分。",
            "value": "F1"
          },
          {
            "id": "family-1-b",
            "label": "B",
            "text": "我會先把支出接下來，確認怎麼補上，再看是否需要請別人分擔。",
            "value": "F2"
          },
          {
            "id": "family-1-c",
            "label": "C",
            "text": "我會先把家裡的需要處理好，自己的安排晚一點再說。",
            "value": "F3"
          },
          {
            "id": "family-1-d",
            "label": "D",
            "text": "我會處理原本屬於我的部分，其他人各自想辦法。",
            "value": "F4"
          },
          {
            "id": "family-1-e",
            "label": "E",
            "text": "我會依家裡原本負責金錢決定的人所做的安排處理。",
            "value": "F5"
          }
        ]
      },
      {
        "id": "family-2",
        "title": "家人臨時希望你幫忙一筆錢",
        "scenario": "家人臨時希望你幫忙一筆錢。",
        "prompt": "你比較可能怎麼回應？",
        "options": [
          {
            "id": "family-2-a",
            "label": "A",
            "text": "我會先想辦法把事情處理起來，再慢慢調整自己的支出。",
            "value": "F2"
          },
          {
            "id": "family-2-b",
            "label": "B",
            "text": "即使會影響原本安排，我多半還是先滿足對方需要。",
            "value": "F3"
          },
          {
            "id": "family-2-c",
            "label": "C",
            "text": "我會先確認這是不是我該負責的；如果不是，通常由對方自行處理。",
            "value": "F4"
          },
          {
            "id": "family-2-d",
            "label": "D",
            "text": "我會依家裡平常做決定的方式處理，不太由我改變。",
            "value": "F5"
          },
          {
            "id": "family-2-e",
            "label": "E",
            "text": "我會先問清楚用途、金額與分擔方式，再決定自己能幫到哪裡。",
            "value": "F1"
          }
        ]
      },
      {
        "id": "family-3",
        "title": "重新分配每月固定支出",
        "scenario": "家裡要重新分配每個月固定支出的負擔。",
        "prompt": "你比較可能怎麼做？",
        "options": [
          {
            "id": "family-3-a",
            "label": "A",
            "text": "我會先把別人的負擔減輕，自己的需要之後再調整。",
            "value": "F3"
          },
          {
            "id": "family-3-b",
            "label": "B",
            "text": "我會希望各自負責清楚的項目，彼此不必過度介入。",
            "value": "F4"
          },
          {
            "id": "family-3-c",
            "label": "C",
            "text": "多半由某位家人決定怎麼分，我照安排負責自己的部分。",
            "value": "F5"
          },
          {
            "id": "family-3-d",
            "label": "D",
            "text": "我會把每個人的收入、需要與限制攤開來談，再訂出能接受的方式。",
            "value": "F1"
          },
          {
            "id": "family-3-e",
            "label": "E",
            "text": "我會主動整理項目、補上缺口，讓家裡的支出先能運作。",
            "value": "F2"
          }
        ]
      },
      {
        "id": "family-4",
        "title": "對一筆錢該不該花，彼此想法不同",
        "scenario": "你和家人對一筆錢該不該花，想法不一樣。",
        "prompt": "你比較可能怎麼處理？",
        "options": [
          {
            "id": "family-4-a",
            "label": "A",
            "text": "我會保留自己的做法，也讓對方處理自己的錢。",
            "value": "F4"
          },
          {
            "id": "family-4-b",
            "label": "B",
            "text": "最後通常會依較有決定權的人意見處理。",
            "value": "F5"
          },
          {
            "id": "family-4-c",
            "label": "C",
            "text": "我會先說出自己的考量，也了解對方在意什麼，再找可接受的方案。",
            "value": "F1"
          },
          {
            "id": "family-4-d",
            "label": "D",
            "text": "我會把決定和後續處理接下來，避免事情一直拖著。",
            "value": "F2"
          },
          {
            "id": "family-4-e",
            "label": "E",
            "text": "為了不讓關係變僵，我多半會先退讓，之後再調整自己。",
            "value": "F3"
          }
        ]
      },
      {
        "id": "family-5",
        "title": "自己的重要支出和家裡需要同時出現",
        "scenario": "你自己有一筆重要支出，同時家裡也有其他用錢需求。",
        "prompt": "你比較可能怎麼安排？",
        "options": [
          {
            "id": "family-5-a",
            "label": "A",
            "text": "我會先看家裡通常由誰決定，再依那個決定安排。",
            "value": "F5"
          },
          {
            "id": "family-5-b",
            "label": "B",
            "text": "我會把兩邊的重要性和能動用的金額說清楚，一起排先後。",
            "value": "F1"
          },
          {
            "id": "family-5-c",
            "label": "C",
            "text": "我會先承擔家裡需要處理的部分，再想辦法安排自己的支出。",
            "value": "F2"
          },
          {
            "id": "family-5-d",
            "label": "D",
            "text": "我多半會先延後自己的需要，讓家裡的事先過去。",
            "value": "F3"
          },
          {
            "id": "family-5-e",
            "label": "E",
            "text": "我會保留自己必要的支出，家裡其他需求由各自負責的人處理。",
            "value": "F4"
          }
        ]
      },
      {
        "id": "family-6",
        "title": "家裡收入突然變少",
        "scenario": "家裡的收入突然變少，原本的分工需要調整。",
        "prompt": "你比較可能怎麼處理？",
        "options": [
          {
            "id": "family-6-a",
            "label": "A",
            "text": "我會提議重新看一次可用資源與必要支出，再一起分配。",
            "value": "F1"
          },
          {
            "id": "family-6-b",
            "label": "B",
            "text": "我會先縮減自己的花費，盡量不增加別人的壓力。",
            "value": "F3"
          },
          {
            "id": "family-6-c",
            "label": "C",
            "text": "家裡平常由誰做決定，這次多半也由那個人決定怎麼調整。",
            "value": "F5"
          },
          {
            "id": "family-6-d",
            "label": "D",
            "text": "我會先多接一些責任，讓日常生活不要中斷。",
            "value": "F2"
          },
          {
            "id": "family-6-e",
            "label": "E",
            "text": "我會重新確認各自能負責的範圍，不一定把所有支出合在一起。",
            "value": "F4"
          }
        ]
      }
    ],
    "profiles": {
      "F1": {
        "code": "F1",
        "name": "先把彼此能負擔的範圍說清楚",
        "path": "共同支出或家人需要出現時，你較常先了解彼此在意的事與能承擔的範圍，再決定怎麼分。這有助於形成共識；若一直等到大家都有完整答案，決定也可能變慢。",
        "action": "先了解彼此在意的事與能承擔的範圍。",
        "help": "比較容易形成共同理解與分工。",
        "watch": "如果要等所有人都有完整答案，決定可能變慢。",
        "step": "選一項共同目標，寫下需要金額、希望完成的時間，以及自己可負擔的部分。",
        "bridge": "把這三項資料帶入生活目標財務規劃，整理每月準備方式；是否與他人分享由自己決定。",
        "primaryTool": "planningTool",
        "otherTools": [
          "monthlyReport",
          "financialFit"
        ]
      },
      "F2": {
        "code": "F2",
        "name": "事情來時，會先承擔眼前需要",
        "path": "當家裡需要有人讓事情繼續運作時，你較常先承擔、補缺口或處理後續。這能快速穩住生活；責任也可能在沒有重新討論時慢慢累積。",
        "action": "先承擔、補上缺口，讓生活繼續運作。",
        "help": "能快速穩住眼前需要。",
        "watch": "責任若沒有重新討論，可能慢慢集中在自己身上。",
        "step": "列出自己固定承擔的三件事，分別標記花費的時間、金錢或能力。",
        "bridge": "把三件事放進時間資源盤點助理，查看責任集中在哪些資源。",
        "primaryTool": "timeResources",
        "otherTools": [
          "healthDashboard",
          "timeline"
        ]
      },
      "F3": {
        "code": "F3",
        "name": "先把自己的需要往後放",
        "path": "家人需要與自己的安排同時出現時，你較常先保住關係或對方的需要。這能讓重要的人感到被照顧；自己的基本生活或目標有時會較晚被看見。",
        "action": "先保住關係或對方的需要。",
        "help": "讓重要的人感到被照顧。",
        "watch": "自己的基本生活與目標，可能比較晚被看見。",
        "step": "寫下一項想保留的生活目標，以及所需金額和希望完成的時間。",
        "bridge": "先用生活目標財務規劃替自己的需要保留位置，再判斷還能協助多少。",
        "primaryTool": "planningTool",
        "otherTools": [
          "timeResources",
          "timeline"
        ]
      },
      "F4": {
        "code": "F4",
        "name": "先分清各自要負責的部分",
        "path": "面對共同支出時，你較常先區分自己的責任與他人的責任，保留彼此空間。這能減少過度承擔；真正共用的項目若沒有另外約定，臨時狀況可能較難銜接。",
        "action": "先分清自己的責任與他人的責任。",
        "help": "保留彼此空間，減少過度承擔。",
        "watch": "真正共用的項目若沒有另外約定，臨時狀況可能較難銜接。",
        "step": "選一項共同支出，記下總額、自己的部分，以及需要一起決定的部分。",
        "bridge": "先把自己的負擔放進財務月報表，確認它對本月收支的影響。",
        "primaryTool": "monthlyReport",
        "otherTools": [
          "healthDashboard",
          "planningTool"
        ]
      },
      "F5": {
        "code": "F5",
        "name": "通常先照家裡原本的方式處理",
        "path": "家裡要作金錢安排時，你較常先依原本負責的人或既有規則處理。這能讓事情較快有方向；自己知道多少、能做主多少，有時不容易被看見。",
        "action": "先照家裡原本負責的人或既有規則處理。",
        "help": "事情能較快有方向。",
        "watch": "自己知道多少、能做主多少，有時不容易被看見。",
        "step": "先整理自己知道的收入、固定支出、預留金與還款狀況；不知道的項目留白。",
        "bridge": "把個人已知資料填入財務健康儀表板，先看見自己能掌握的範圍，不必交出或分享結果。",
        "primaryTool": "healthDashboard",
        "otherTools": [
          "timeline",
          "monthlyReport"
        ]
      }
    },
    "fallbackTool": "timeResources",
    "safetyNote": "結果只描述本次作答中較常出現的決定方式，不判定關係是否失衡。資料預設只供本人查看，不自動保存、分享或要求共同填寫；是否和家人談錢、使用共同工具或分享結果，由使用者在感到安全且願意時自行決定。"
  },
  "plan": {
    "id": "plan",
    "kind": "dominant_pattern",
    "eyebrow": "主題探索",
    "title": "我的財務計畫卡在哪裡？",
    "shortTitle": "我的財務計畫卡在哪裡",
    "description": "看見自己從想做、開始做，到生活出現變化時，通常在哪個環節改變原本決定。",
    "awarenessFocus": "面對財務計畫時，我會先縮小步驟、同時推很多目標、立刻開始、準備完整，還是先回應生活變化？",
    "duration": "約 2 分鐘",
    "minimumValid": 5,
    "questions": [
      {
        "id": "plan-1",
        "title": "為生活目標存一筆錢",
        "scenario": "你想存一筆錢完成一個生活目標。",
        "prompt": "你比較可能怎麼開始？",
        "options": [
          {
            "id": "plan-1-a",
            "label": "A",
            "text": "我會先定一個做得到的金額，固定執行，再依情況調整。",
            "value": "A1"
          },
          {
            "id": "plan-1-b",
            "label": "B",
            "text": "我會同時想到好幾個目標，常需要在它們之間分配。",
            "value": "A2"
          },
          {
            "id": "plan-1-c",
            "label": "C",
            "text": "我通常會很快開始，但過一陣子容易被別的事取代。",
            "value": "A3"
          },
          {
            "id": "plan-1-d",
            "label": "D",
            "text": "我會先把方法、金額和時間想完整，準備得差不多才開始。",
            "value": "A4"
          },
          {
            "id": "plan-1-e",
            "label": "E",
            "text": "我原本會安排，但生活一有臨時支出，計畫就容易往後移。",
            "value": "A5"
          }
        ]
      },
      {
        "id": "plan-2",
        "title": "改善一項財務習慣",
        "scenario": "你決定要改善一項財務習慣。",
        "prompt": "你比較可能怎麼做？",
        "options": [
          {
            "id": "plan-2-a",
            "label": "A",
            "text": "我會想一次處理好幾件事，例如記帳、存錢和減少支出。",
            "value": "A2"
          },
          {
            "id": "plan-2-b",
            "label": "B",
            "text": "我會趁有動力時立刻開始，但不一定先安排怎麼持續。",
            "value": "A3"
          },
          {
            "id": "plan-2-c",
            "label": "C",
            "text": "我會先找完整的方法或工具，確認合適後才開始。",
            "value": "A4"
          },
          {
            "id": "plan-2-d",
            "label": "D",
            "text": "我會先排進生活裡，但工作或家事一忙就容易中斷。",
            "value": "A5"
          },
          {
            "id": "plan-2-e",
            "label": "E",
            "text": "我會先挑一個最小的動作，安排固定時間做。",
            "value": "A1"
          }
        ]
      },
      {
        "id": "plan-3",
        "title": "原本的安排連續幾次沒做到",
        "scenario": "原本安排的財務行動，連續幾次沒有做到。",
        "prompt": "接下來你比較可能怎麼做？",
        "options": [
          {
            "id": "plan-3-a",
            "label": "A",
            "text": "我會覺得節奏斷了，過一陣子再重新開始。",
            "value": "A3"
          },
          {
            "id": "plan-3-b",
            "label": "B",
            "text": "我會先找出更完整的做法，調整好再繼續。",
            "value": "A4"
          },
          {
            "id": "plan-3-c",
            "label": "C",
            "text": "我會先處理眼前的生活變化，原本計畫之後再說。",
            "value": "A5"
          },
          {
            "id": "plan-3-d",
            "label": "D",
            "text": "我會把步驟縮小，從現在做得到的部分接回來。",
            "value": "A1"
          },
          {
            "id": "plan-3-e",
            "label": "E",
            "text": "我可能改做另一個也很想完成的目標，原本那項先擺著。",
            "value": "A2"
          }
        ]
      },
      {
        "id": "plan-4",
        "title": "看到一個想試的理財方法",
        "scenario": "你看到一個看起來很有用的理財方法。",
        "prompt": "你比較可能怎麼反應？",
        "options": [
          {
            "id": "plan-4-a",
            "label": "A",
            "text": "我會先研究清楚，確定每個步驟都適合自己再開始。",
            "value": "A4"
          },
          {
            "id": "plan-4-b",
            "label": "B",
            "text": "我會想試，但常因最近生活太忙而往後延。",
            "value": "A5"
          },
          {
            "id": "plan-4-c",
            "label": "C",
            "text": "我會先試一個小步驟，觀察有沒有幫助再調整。",
            "value": "A1"
          },
          {
            "id": "plan-4-d",
            "label": "D",
            "text": "我會把它加進原本想做的幾件事，之後再決定先做哪個。",
            "value": "A2"
          },
          {
            "id": "plan-4-e",
            "label": "E",
            "text": "我會當下就開始做，熱度過後不一定繼續。",
            "value": "A3"
          }
        ]
      },
      {
        "id": "plan-5",
        "title": "計畫進行中，突然多了一筆支出",
        "scenario": "執行計畫時，突然出現一筆沒有預期的支出。",
        "prompt": "你比較可能怎麼處理？",
        "options": [
          {
            "id": "plan-5-a",
            "label": "A",
            "text": "我會先處理眼前需要，原本計畫通常停一段時間。",
            "value": "A5"
          },
          {
            "id": "plan-5-b",
            "label": "B",
            "text": "我會保留能做到的最低進度，等狀況穩定再調回來。",
            "value": "A1"
          },
          {
            "id": "plan-5-c",
            "label": "C",
            "text": "我會重新看所有目標，常在好幾個方向之間重新分配。",
            "value": "A2"
          },
          {
            "id": "plan-5-d",
            "label": "D",
            "text": "我會換一個新的做法，希望更快把進度補回來。",
            "value": "A3"
          },
          {
            "id": "plan-5-e",
            "label": "E",
            "text": "我會先重新算清楚，等新的安排完整後再繼續。",
            "value": "A4"
          }
        ]
      },
      {
        "id": "plan-6",
        "title": "一個月後回頭看計畫",
        "scenario": "一個月後，你回頭看原本訂的財務計畫。",
        "prompt": "哪個狀況比較接近你？",
        "options": [
          {
            "id": "plan-6-a",
            "label": "A",
            "text": "每個目標好像都有做一點，但很難看出哪一個真的往前。",
            "value": "A2"
          },
          {
            "id": "plan-6-b",
            "label": "B",
            "text": "常因臨時事件改變安排，進度和原本想的不太一樣。",
            "value": "A5"
          },
          {
            "id": "plan-6-c",
            "label": "C",
            "text": "剛開始很有動力，後來就慢慢沒有繼續。",
            "value": "A3"
          },
          {
            "id": "plan-6-d",
            "label": "D",
            "text": "即使進度不大，通常還有持續，也知道下一步要做什麼。",
            "value": "A1"
          },
          {
            "id": "plan-6-e",
            "label": "E",
            "text": "可能還在整理方法或等更合適的時機，實際進度不多。",
            "value": "A4"
          }
        ]
      }
    ],
    "profiles": {
      "A1": {
        "code": "A1",
        "name": "先把計畫縮小到做得下去",
        "path": "你較常把計畫拆成做得到的動作，即使生活有變化，也會保留一點進度。這讓行動比較穩定；同時要留意步驟是否仍連向真正想完成的目標。",
        "action": "把計畫拆成現在做得到的小步驟。",
        "help": "生活有變化時，仍能保留一點進度。",
        "watch": "也要確認小步驟仍連向真正想完成的目標。",
        "step": "寫下目前最重要的目標、需要金額、希望完成的時間，以及本月能先準備多少。",
        "bridge": "把這四項資料放進生活目標財務規劃，整理可持續的每月準備方式。",
        "primaryTool": "planningTool",
        "otherTools": [
          "savingsQuick"
        ]
      },
      "A2": {
        "code": "A2",
        "name": "同時想推進多個目標",
        "path": "你對生活有不少想改善的地方，決定時常把多個目標一起放進來。這代表你看見很多可能；資源也容易被分散，較難看出哪一項真的往前。",
        "action": "把多個想改善的目標一起放進計畫。",
        "help": "保留對生活的多種期待與可能。",
        "watch": "資源容易分散，較難看出哪一項真的往前。",
        "step": "列出目前的目標與大概金額，只選一項作為這個月先處理的目標。",
        "bridge": "先把選出的目標放進生活目標財務規劃，其餘保留在之後清單。",
        "primaryTool": "planningTool",
        "otherTools": [
          "healthDashboard",
          "savingsQuick"
        ]
      },
      "A3": {
        "code": "A3",
        "name": "先開始，再看能不能維持",
        "path": "你較常趁有動力時立刻開始，讓想法很快變成行動。這能跨過起步門檻；當熱度下降或方法需要調整時，原本行動可能較難接續。",
        "action": "趁有動力時先開始。",
        "help": "讓想法很快變成行動，跨過起步門檻。",
        "watch": "熱度下降或方法要調整時，行動可能較難接續。",
        "step": "把目標縮成每月最低準備金額，並寫下希望完成的時間。",
        "bridge": "用生活目標財務規劃檢查這個最低版本是否能維持並接近目標。",
        "primaryTool": "planningTool",
        "otherTools": [
          "accounting",
          "monthlyReport"
        ]
      },
      "A4": {
        "code": "A4",
        "name": "想準備完整再開始",
        "path": "你希望先把方法、風險與細節弄清楚，再投入時間或金錢。這能減少不必要的嘗試；準備條件若一直增加，行動也可能延後。",
        "action": "先把方法、風險與細節準備好。",
        "help": "減少不必要的嘗試與損失。",
        "watch": "準備條件若一直增加，行動也可能延後。",
        "step": "先寫下目標金額、目前已有金額，以及每月可以準備多少。",
        "bridge": "把三個數字輸入儲蓄目標試算，先看預估時間，再決定是否調整。",
        "primaryTool": "savingsQuick",
        "otherTools": [
          "planningTool",
          "healthDashboard"
        ]
      },
      "A5": {
        "code": "A5",
        "name": "生活有變化時，先處理眼前需要",
        "path": "臨時支出、工作或家庭責任出現時，你較常先顧眼前需要，再把計畫往後移。這讓生活保有應變空間；計畫若沒有最低版本，容易一直等不到穩定時機。",
        "action": "生活有變化時，先處理眼前需要。",
        "help": "保留應變空間，先讓生活走得下去。",
        "watch": "計畫如果沒有最低版本，可能一直等不到穩定時機。",
        "step": "記下原本每月準備金額、這次臨時支出，以及本月仍能保留的最低金額。",
        "bridge": "把變動放進財務月報表，重新確認本月收支後再設定最低進度。",
        "primaryTool": "monthlyReport",
        "otherTools": [
          "timeResources",
          "planningTool"
        ]
      }
    },
    "fallbackTool": "planningTool",
    "safetyNote": ""
  }
};
export const ASSESSMENT_ORDER = ['entry', 'clarity', 'pressure', 'family', 'plan'];
