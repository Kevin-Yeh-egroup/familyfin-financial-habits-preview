---
version: "v11.5-validation-draft"
name: "FamilyFin Progressive Financial Exploration"
description: "One lightweight entry assessment plus four optional topic explorations for Taiwan Traditional Chinese readers."
colors:
  primary: "#995064"
  accent: "#C98267"
  sage: "#788E75"
  background: "#FBF8F4"
  surface: "#FFFFFF"
  text: "#4D3730"
  text-muted: "#6B5A52"
  border: "#E7D8CD"
---

## Product maturity

This design is a validation-ready discovery draft. It now includes the 8-question entry assessment plus 24 extension questions, provisional scoring, result language, and tool-routing rules. Complete content does not mean questionnaire validity, stable classification, or build readiness; all five assessments still require cognitive interviewing, small-sample testing, and content-owner confirmation.

## Experience architecture

The experience uses one 8-question entry assessment and four optional 6-question topic explorations. The entry assessment answers what the person tends to consider first when making money decisions. Completing it opens one integrated 「我的財務決策總覽」: the entry summary and graphical analysis appear first, followed by all four extensions, with one related topic marked as a suggested starting point without hiding the others. There is no separate entry-result destination.

The four extensions answer different questions:

1. Financial clarity: what the person already knows and still needs to check.
2. Pressure and spending: which pressures change money behavior.
3. Family money boundaries: how relationships, responsibility, and decision power affect choices.
4. Plan follow-through: whether the current obstacle is the goal, next step, tracking, or disruption.

The extensions have no required order. Each completed topic adds one separate result to the current exploration overview. Unanswered topics are shown as not yet explored and are not inferred. A completed result can be opened as a summary or replaced by a new result after a retest is finished.

When all five explorations are complete, the overview adds a non-scored decision map and a combined narrative. It places the entry result and four extension results side by side without converting them into one scale, causal explanation, or complete financial assessment.

All four extensions are six-question multiple-choice assessments. A participant must answer each question before continuing; selecting 「我沒有遇過這個狀況」 completes the question but is unscored. The result appears only after all six questions. The user first sees a decision-awareness summary and completes one small preparation step. That step produces the starting information for the recommended tool. The tool section starts expanded and may be collapsed. The resonance question appears at the bottom after the result, tools, and navigation actions.

## Decision-awareness principle

The purpose is not to tell a person which type they are. Every result should help the person recognize a decision path: what situation triggered the choice, what they noticed or protected first, what they did next, and what that response may help or make harder. Public wording uses 「這次作答中，你在……時較常先……」 and includes both the useful function and a possible limitation of the response.

Question options describe concrete first actions. Internal fields retain the trigger, first concern, first reaction, possible impact, result direction, and tool signal; none are shown during answering. A participant should finish any assessment able to say, 「我在什麼情況下，會先在意什麼，然後作出什麼決定？」

## Entry assessment

The public working title is 「做金錢決定時，我通常先在意什麼？」. The entry assessment uses eight daily-life situations with four plausible actions and an optional unscored answer for a situation the person has not encountered. Each answer maps transparently to one internal working tendency. The eight tendencies each appear four times across the answer set and rotate across answer positions. Each option must express one primary decision reason; mixed-reason options are revised during cognitive interviewing.

When all eight questions are answered, selected counts are directly comparable because every tendency has four opportunities. If one or two questions are marked not encountered, the internal comparison uses selected count divided by valid opportunities for that tendency. At least six scored answers are required. These are exploration clues, not a personality, ability, psychological, or relationship diagnosis.

Public results use descriptive wording rather than fixed personality labels:

- 重視安心與準備
- 重視當下需要
- 先比較再決定
- 願意先試再調整
- 重視關係需要
- 重視成果肯定
- 視情況調整
- 需要空間再處理

The result may show one tendency, two tied leading tendencies, one unique secondary tendency, or that several considerations are present. Any leading or secondary tendency requires at least two actual selections; otherwise the result says the clues are dispersed or insufficient. It never uses a hidden tie-breaker to force a unique result. Normally one extension is recommended; two equal next-topic choices appear only when two leading considerations tie and route to different topics.

## Result hierarchy

1. Open with a short result summary describing what appeared more often in this set of answers.
2. In the entry result, keep the plain-language description as the main heading and expose the approved eight-type name as a secondary label. Use non-ranking labels for secondary or shared directions; mixed and insufficient results do not force a single type.
3. Follow with 「結果摘要與分析」: an equal-weight three-node path for what appeared, what it helps, and what may deserve attention. Entry analysis branches pair the type name with its plain-language description. No axis, score, area, distance, or color implies strength.
4. Show every detected direction before asking the user to choose a focus. In tied or mixed results, the focus choice changes only the small step and tool route; it never hides or rewrites the other directions.
5. Immediate extension results may include selected-situation evidence. A revisited summary does not reconstruct evidence because raw answers are not retained.
6. Offer one private preparation action that takes about ten minutes and produces the starting information for the primary tool.
7. For an extension result, show 「用剛剛整理的內容繼續」 only after the result and small step. It starts expanded with one primary tool and no more than two related resources. At the bottom, 「回到我的財務決策總覽」 is the first and primary action; retesting is a quiet secondary action.
8. Keep 「我的財務決策總覽」 as the only entry-result destination. The entry result is embedded once in the overview with a retest action; its completed progress card is omitted. Completed extension cards offer summary-analysis and retest actions, and their individual result pages do not repeat the overview.
9. At five completed explorations, show 「恭喜你完成 5 項探索」 and a fixed one-entry-plus-four-topic decision map. Follow it with a structured synthesis rather than five parallel result sentences: an overall decision rhythm, the information-to-action and pressure-to-relationship links, one strength, one watchpoint, and one next step. These sentences may use only the saved classification and reviewed profile action/help/watch/step copy; ties and insufficient results must remain explicit.
10. End the five-part synthesis with 「嘗試使用以下工具」 and exactly three distinct tools. Give every extension topic one result-led candidate before drawing extra candidates from any topic, use the entry route only to order topics, and use topic fallback tools only when result-led candidates are insufficient. Do not present fallback tools as precise personalization. State that the five angles have no high or low and do not form a total score or diagnosis.

In the entry-only MVP, an extension that is not live is labeled as planned. The interface may collect which topic the person wants to explore first, but it does not show a dead navigation control or imply that the extension can already be completed.

The 8-question forced-choice entry result does not use a radar chart because the counts are relative choices, not eight independent ability scales. A radar chart may be reconsidered only after comparable extension dimensions and scoring are defined.

## Progress and storage

Progress is a locator, not a score or completeness judgment. Do not use percentages, unlock states, streaks, rankings, red missing-state warnings, or language implying that five results equal a complete financial evaluation.

Raw answers remain in page memory while answering and use the existing one-shot `sessionStorage` transfer only for result calculation. That transfer is deleted when read. A separate, versioned same-tab summary stores only the assessment id, classification keys, and entry recommendation ids. It explicitly excludes answers, option ids, counts, rates, averages, resonance responses, tool clicks, identity data, and member records. Closing the tab clears this session summary. Starting a retest preserves the prior summary until the new attempt is completed successfully.

Because raw answers are not retained, a revisited result cannot reconstruct the original selected-situation evidence. The integrated entry overview therefore uses the same classification summary and graphical analysis both immediately after completion and after reload, without showing transient evidence. Extension results may still show selected-situation evidence immediately after completion but not after reload.

## Visual strategy

Use code-native HTML and CSS for result visuals. A single result uses three connected, equal-size nodes for response, useful function, and point to notice. The five-completion overview uses one central entry node and four equal-size topic nodes; connections mean only “viewed together,” not sequence or causation. On mobile, both visuals become accessible vertical paths. Do not use radar charts, axes, percentages, bars, node sizes, or color intensity to imply strength.

Pause eight character illustrations until names, definitions, questions, and scoring are validated. Neutral icons are sufficient during discovery: compass, ledger, breathing line, conversation boundary, footsteps, and puzzle pieces.

## Safety and tone

Use phrases such as 「這次作答中較常出現」 rather than 「你就是」. Results do not infer personality, financial ability, diagnosis, income, service eligibility, or whether human consultation is required.

Family-boundary results describe the current interaction pattern and never diagnose a relationship as unsafe or imbalanced from six answers. The product does not automatically recommend joint money conversations when refusal, access to money, or personal safety may be constrained.

## Responsive behavior

Each assessment shows one question at a time. Selecting an answer briefly preserves the selected state and then advances automatically; keyboard users retain a next-question control. Progress is the current question number, not the count of selected answers. The question area stays visually stable to avoid vertical jumping, previous answers remain editable within the current session, and the primary route is verified at 360, 393, and 430 px widths.
