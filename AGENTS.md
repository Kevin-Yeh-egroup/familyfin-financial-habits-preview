# FamilyFin Financial Habits Questionnaire

## Source and workflow

- This repository is the canonical source for the financial-habits questionnaire.
- Start partner changes from `main` in a separate Codex Worktree.
- Use a short branch name such as `codex/cilia-result-copy`.
- Partners may prepare a commit and Draft PR. Kevin is the owner for merging `main` and deployment decisions.
- Do not use real client, household, financial, contact, account, or case data. Use synthetic examples only.

## Editing boundaries

- Editorial sources are `build_ivy_one_plus_four_report.py`, `extension_assessment_content.py`, and `generate_assessment_data.py`.
- `data.mjs` is generated runtime data. Do not edit it by hand; regenerate it from the editorial sources and review the diff.
- `publish-ready/`, `tests/artifacts/`, `.vercel/`, caches, and local outputs are not authoritative source.
- UI copy, layout, navigation, and low-risk guidance may be changed when the prompt clearly requests them.
- Stop and ask Kevin before changing scoring, assessment meaning, result classification, data retention, privacy behavior, permissions, integrations, or deployment configuration.
- Never push, create or update a PR, merge, deploy, install dependencies, or change an external account unless the user explicitly authorizes that action in the current task.

## Verification

Run the relevant checks after a change:

```powershell
node --test tests/scoring.test.mjs tests/progress.test.mjs tests/ui-contract.test.mjs
python -m http.server 8766 --bind 127.0.0.1
node tests/browser-smoke.mjs
```

Use the same synthetic scenario before and after the change. Report changed files, test results, the local preview URL, unresolved questions, and how to revert. Do not claim that a local change has reached the public URL.
