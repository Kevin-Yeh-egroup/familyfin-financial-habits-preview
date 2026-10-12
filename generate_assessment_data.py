"""Build the browser-ready assessment registry from the approved discussion sources.

The Python files remain the editorial source. This generator removes internal
scoring labels from public answer copy and emits structured values for the
browser. Run it and review stdout before replacing ``data.mjs``.
"""

from __future__ import annotations

import json

from build_ivy_one_plus_four_report import ENTRY_QUESTIONS, TYPE_DEFINITIONS
from extension_assessment_content import EXTENSION_ASSESSMENTS


TYPE_KEYS = {
    "安全規劃型": "security",
    "當下滿足型": "present",
    "精算判斷型": "planning",
    "行動嘗試型": "action",
    "關係照顧型": "relationship",
    "成就證明型": "achievement",
    "彈性應變型": "adaptive",
    "延後面對型": "pause",
}

NEXT_ASSESSMENTS = {
    "我看得懂自己的錢嗎": "clarity",
    "我看得懂自己的錢嗎？": "clarity",
    "壓力來時我會怎麼用錢": "pressure",
    "壓力來時，我會怎麼用錢？": "pressure",
    "我的家庭金錢界線": "family",
    "我和家人的金錢界線清楚嗎？": "family",
    "我的財務計畫卡在哪裡": "plan",
    "我的財務計畫卡在哪裡？": "plan",
}

ENTRY_REFLECTIONS = {
    "security": {
        "help": "這能先顧住基本生活與意外變化，讓決定多一點安心。",
        "watch": "也可以留意：想把風險都準備好時，是否讓原本可以調整的選擇一起停下來。",
    },
    "present": {
        "help": "這能讓金錢回應當下真正的生活需要，不只剩下數字。",
        "watch": "也可以留意：照顧現在之後，有沒有替接下來不能延後的支出留下位置。",
    },
    "planning": {
        "help": "這能幫你看清條件與後續影響，減少倉促決定。",
        "watch": "也可以留意：資料還沒完全齊全時，是否仍有一個可以先做的小步驟。",
    },
    "action": {
        "help": "這能降低開始的門檻，從實際經驗中慢慢調整。",
        "watch": "也可以留意：開始以前，是否看過可用金額與之後要承擔的部分。",
    },
    "relationship": {
        "help": "這能把共同生活與重要關係放進決定，不讓金錢只剩個人的計算。",
        "watch": "也可以留意：照顧別人時，自己的基本生活與能負擔的界線有沒有一起被看見。",
    },
    "achievement": {
        "help": "這能讓金錢支持目標，也讓長期努力有看得見的成果。",
        "watch": "也可以留意：想證明努力值得時，這筆花費是否仍符合現在的生活空間。",
    },
    "adaptive": {
        "help": "這能保留選擇空間，生活出現變化時不必被原本計畫綁住。",
        "watch": "也可以留意：每次調整之後，自己是否仍知道錢去了哪裡、還剩下多少。",
    },
    "pause": {
        "help": "這能在壓力太大時替自己留一點喘息，不必勉強立刻做完所有決定。",
        "watch": "也可以留意：暫停之後，是否留下一個容易回來的時間或最小步驟。",
    },
}

# Structured copy for the visual result path. Keep this separate from ``path``:
# ``path`` is the warm narrative paragraph, while these three fields make the
# analysis readable as an equal-weight, non-scored diagram without parsing
# punctuation from prose.
EXTENSION_REFLECTIONS = {
    "map": {
        "action": "先把可用收入、固定責任與近期變化放在一起看。",
        "help": "減少遺漏，也比較知道這次能調整多少。",
        "watch": "如果一直等到資訊很完整，行動可能會晚一點開始。",
    },
    "outline": {
        "action": "先抓住主要收入、固定支出與大筆款項。",
        "help": "讓日常安排維持簡單，也能快速掌握大方向。",
        "watch": "多筆變化一起出現時，資料可能需要重新整理。",
    },
    "on_demand": {
        "action": "先處理眼前需要，需要時再補查資料。",
        "help": "保留應變速度，不必每次都先整理完整帳目。",
        "watch": "資料散在不同地方時，同一件事可能要反覆確認。",
    },
    "current": {
        "action": "從帳戶餘額、到期提醒或眼前支出開始。",
        "help": "先顧到現在最迫切的事情。",
        "watch": "較晚出現的固定責任與未來支出，可能不容易一起被看見。",
    },
    "P1": {
        "action": "先確認金額、期限與手邊資源。",
        "help": "減少倉促決定，讓事情有次序。",
        "watch": "如果一直停在整理，第一步可能會延後。",
    },
    "P2": {
        "action": "先用一筆花費讓自己放鬆或得到安慰。",
        "help": "在壓力高的時候，先讓自己有力氣撐過當下。",
        "watch": "原本的壓力與後續支出，有時會一起往後移。",
    },
    "P3": {
        "action": "先不看、不回覆，晚一點再處理。",
        "help": "避免一下子被太多資訊或情緒壓住。",
        "watch": "帳單與期限也可能一起被放下。",
    },
    "P4": {
        "action": "先減少支出，快速把金錢收緊。",
        "help": "短期內找回掌控感。",
        "watch": "規則過緊時，生活需要也可能難以維持。",
    },
    "P5": {
        "action": "先用金錢照顧感受、關係或眼前需要。",
        "help": "快速傳達支持，先顧住重要的人與事。",
        "watch": "自己的資源與後續安排，可能比較晚被看見。",
    },
    "F1": {
        "action": "先了解彼此在意的事與能承擔的範圍。",
        "help": "比較容易形成共同理解與分工。",
        "watch": "如果要等所有人都有完整答案，決定可能變慢。",
    },
    "F2": {
        "action": "先承擔、補上缺口，讓生活繼續運作。",
        "help": "能快速穩住眼前需要。",
        "watch": "責任若沒有重新討論，可能慢慢集中在自己身上。",
    },
    "F3": {
        "action": "先保住關係或對方的需要。",
        "help": "讓重要的人感到被照顧。",
        "watch": "自己的基本生活與目標，可能比較晚被看見。",
    },
    "F4": {
        "action": "先分清自己的責任與他人的責任。",
        "help": "保留彼此空間，減少過度承擔。",
        "watch": "真正共用的項目若沒有另外約定，臨時狀況可能較難銜接。",
    },
    "F5": {
        "action": "先照家裡原本負責的人或既有規則處理。",
        "help": "事情能較快有方向。",
        "watch": "自己知道多少、能做主多少，有時不容易被看見。",
    },
    "A1": {
        "action": "把計畫拆成現在做得到的小步驟。",
        "help": "生活有變化時，仍能保留一點進度。",
        "watch": "也要確認小步驟仍連向真正想完成的目標。",
    },
    "A2": {
        "action": "把多個想改善的目標一起放進計畫。",
        "help": "保留對生活的多種期待與可能。",
        "watch": "資源容易分散，較難看出哪一項真的往前。",
    },
    "A3": {
        "action": "趁有動力時先開始。",
        "help": "讓想法很快變成行動，跨過起步門檻。",
        "watch": "熱度下降或方法要調整時，行動可能較難接續。",
    },
    "A4": {
        "action": "先把方法、風險與細節準備好。",
        "help": "減少不必要的嘗試與損失。",
        "watch": "準備條件若一直增加，行動也可能延後。",
    },
    "A5": {
        "action": "生活有變化時，先處理眼前需要。",
        "help": "保留應變空間，先讓生活走得下去。",
        "watch": "計畫如果沒有最低版本，可能一直等不到穩定時機。",
    },
}

TOOL_KEYS = {
    "記帳助理": "accounting",
    "財務月報表": "monthlyReport",
    "財務健康儀表板": "healthDashboard",
    "生活目標財務規劃": "planningTool",
    "儲蓄目標試算": "savingsQuick",
    "時間資源盤點助理": "timeResources",
    "生命歷程整理": "timeline",
    "財務韌性檢測": "resilience",
    "財務合拍檢測": "financialFit",
    "財務焦慮檢測": "financialAnxiety",
}

TOOLS = {
    "accounting": {
        "name": "記帳助理",
        "description": "先記一筆實際收支，逐步看清日常金錢流向。",
        "href": "https://www.familyfinhealth.com/toolbox/accounting",
        "action": "開始記一筆",
    },
    "monthlyReport": {
        "name": "財務月報表",
        "description": "把收入、支出、資產與負債放在一起，看見目前能運用的空間。",
        "href": "https://www.familyfinhealth.com/toolbox/monthly-report",
        "action": "整理本月輪廓",
    },
    "healthDashboard": {
        "name": "財務健康儀表板",
        "description": "從收支、預備金、負債與保障等條件，盤點目前的生活底盤。",
        "href": "https://www.familyfinhealth.com/toolbox/financial-health-dashboard",
        "action": "開始八項盤點",
    },
    "planningTool": {
        "name": "生活目標財務規劃",
        "description": "選一件想完成的事，把時間、金額與每月可準備的步驟放在一起。",
        "href": "https://www.familyfinhealth.com/toolbox/planning",
        "action": "規劃一件事",
    },
    "savingsQuick": {
        "name": "儲蓄目標試算",
        "description": "用概略金額試算準備時間，看看目標可以怎麼累積。",
        "href": "https://www.familyfinhealth.com/toolbox/planning/quick",
        "action": "試算一個目標",
    },
    "timeResources": {
        "name": "時間資源盤點助理",
        "description": "除了錢，也整理目前能運用的時間、能力與生活資源。",
        "href": "https://www.familyfinhealth.com/toolbox/time-resource-inventory",
        "action": "盤點可用資源",
    },
    "timeline": {
        "name": "生命歷程整理",
        "description": "從一件重要事件開始，整理人物、時間與生活變化。",
        "href": "https://www.familyfinhealth.com/toolbox/case-timeline",
        "action": "整理一個片段",
    },
    "resilience": {
        "name": "財務韌性檢測",
        "description": "看看生活遇到變動時，目前有哪些承接與調整空間。",
        "href": "https://www.familyfinhealth.com/financial-resilience",
        "action": "看看財務韌性",
    },
    "financialFit": {
        "name": "財務合拍檢測",
        "description": "如果彼此都願意，可以各自作答後再交換對金錢的想法。",
        "href": "https://www.familyfinhealth.com/financial-fit",
        "action": "了解雙人檢測",
    },
    "financialAnxiety": {
        "name": "財務焦慮檢測",
        "description": "看見金錢壓力如何影響感受與日常反應。",
        "href": "https://www.familyfinhealth.com/financial-anxiety",
        "action": "看看壓力的影響",
    },
}


def slug_option(question_id: str, label: str) -> str:
    return f"{question_id}-{label.lower()}"


def tool_key(name: str) -> str:
    plain = name.split("（", 1)[0]
    return TOOL_KEYS[plain]


def make_entry_profiles() -> dict[str, dict]:
    profiles = {}
    for item in TYPE_DEFINITIONS:
        key = TYPE_KEYS[item["code"]]
        profiles[key] = {
            "key": key,
            "typeName": item["code"],
            "name": item["public"],
            "meaning": item["meaning"],
            "help": ENTRY_REFLECTIONS[key]["help"],
            "watch": ENTRY_REFLECTIONS[key]["watch"],
            "nextAssessment": NEXT_ASSESSMENTS[item["next"]],
            "followupQuestion": item["question"],
        }
    return profiles


def make_entry() -> dict:
    questions = []
    for index, item in enumerate(ENTRY_QUESTIONS, 1):
        question_id = f"entry-{index}"
        scenario = item["scenario"]
        prompt = "選一個最接近你第一個反應的做法。"
        for marker in ("你最可能先怎麼做？", "你最可能怎麼決定？", "你最可能先在意什麼？", "你最可能從哪裡開始？"):
            if scenario.endswith(marker):
                scenario = scenario[: -len(marker)].strip()
                prompt = marker
                break
        options = [
            {
                "id": slug_option(question_id, label),
                "label": label,
                "text": text,
                "value": TYPE_KEYS[internal],
            }
            for label, text, internal in item["options"]
        ]
        questions.append(
            {
                "id": question_id,
                "title": item["title"],
                "scenario": scenario,
                "prompt": prompt,
                "options": options,
            }
        )
    return {
        "id": "entry",
        "kind": "entry_tendency",
        "eyebrow": "入口探索",
        "title": "做金錢決定時，我通常先在意什麼？",
        "shortTitle": "我的金錢決定",
        "description": "從生活中的用錢選擇，看見自己做決定時較常先放在心裡的事。",
        "duration": "約 2 分鐘",
        "minimumValid": 6,
        "questions": questions,
        "profiles": make_entry_profiles(),
    }


def make_extension(source: dict) -> dict:
    assessment_id = source["code"]
    title = source["title"]
    if assessment_id == "family":
        title = "我和家人的金錢界線清楚嗎？"
    questions = []
    for index, item in enumerate(source["questions"], 1):
        question_id = f"{assessment_id}-{index}"
        options = []
        for option in item["options"]:
            raw_value = option["internal"].split("｜", 1)[0]
            value = int(raw_value) if source["result_kind"] == "mean_state" else raw_value
            options.append(
                {
                    "id": slug_option(question_id, option["label"]),
                    "label": option["label"],
                    "text": option["text"],
                    "value": value,
                }
            )
        questions.append(
            {
                "id": question_id,
                "title": item["title"],
                "scenario": item["scenario"],
                "prompt": item["prompt"],
                "options": options,
            }
        )
    profiles = {}
    for item in source["results"]:
        other_tools = [tool_key(name.strip()) for name in item["others"].split("、") if name.strip()]
        reflection = EXTENSION_REFLECTIONS[item["code"]]
        profiles[item["code"]] = {
            "code": item["code"],
            "name": item["name"],
            "path": item["path"],
            "action": reflection["action"],
            "help": reflection["help"],
            "watch": reflection["watch"],
            "step": item["step"],
            "bridge": item["bridge"],
            "primaryTool": tool_key(item["primary"]),
            "otherTools": other_tools[:2],
        }
    return {
        "id": assessment_id,
        "kind": source["result_kind"],
        "eyebrow": "主題探索",
        "title": title,
        "shortTitle": title.replace("？", ""),
        "description": source["purpose"],
        "awarenessFocus": source["awareness_focus"],
        "duration": "約 2 分鐘",
        "minimumValid": 5,
        "questions": questions,
        "profiles": profiles,
        "fallbackTool": tool_key(source["fallback_tool"]),
        "safetyNote": source.get("safety_note", ""),
    }


def build_registry() -> dict[str, dict]:
    registry = {"entry": make_entry()}
    for source in EXTENSION_ASSESSMENTS:
        registry[source["code"]] = make_extension(source)
    return registry


def main() -> None:
    registry = build_registry()
    print("// Generated from the reviewed 1+4 assessment sources. Do not expose option.value in the UI.")
    print("export const APP_VERSION = 'decision-awareness-1plus4-v1.0';")
    print("export const ATTEMPT_VERSION = 10;")
    print("export const STORAGE_KEY = 'familyfin.decision-awareness.v10.transfer';")
    print("export const NOT_ENCOUNTERED = 'not_encountered';")
    print(f"export const TOOLS = {json.dumps(TOOLS, ensure_ascii=False, indent=2)};")
    print(f"export const ASSESSMENTS = {json.dumps(registry, ensure_ascii=False, indent=2)};")
    print("export const ASSESSMENT_ORDER = ['entry', 'clarity', 'pressure', 'family', 'plan'];")


if __name__ == "__main__":
    main()
