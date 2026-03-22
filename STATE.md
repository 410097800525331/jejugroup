# STATE

## Current Task

- task: `Remove the obsolete jeju-web mirror pre-commit block now that front work no longer syncs into jeju-web`
- phase: `implementation`
- scope: `.githooks/pre-commit, scripts/guards/**, package.json, docs/text-integrity-guardrails.md`
- verification_target: `Commits should no longer be blocked by jeju-web mirror mismatch checks while the remaining text-integrity guard still runs and the docs/scripts reflect the new workflow`

## Route

- route: `Route A`
- reason: `Small bounded workflow adjustment across hook/guard/docs files with no shared runtime or mirror implementation changes`

## Writer Slot

- owner: `main`
- write_set: `.githooks/pre-commit, scripts/guards/**, package.json, docs/text-integrity-guardrails.md`
- note: `Keep the change limited to disabling the obsolete jeju-web mirror guard and aligning the developer-facing workflow text.`

## Contract Freeze

- contract_freeze: `Do not edit application source files. Remove the pre-commit requirement that front changes must already be mirrored into jeju-web, and update the related guard/doc/package messaging so the current front -> jeju-spring workflow is what developers see.`

## Seed

- status: `n/a`
- path: `n/a`
- revision: `n/a`
- note: `Spec-first skipped because this is a small developer-workflow adjustment.`

## Reviewer

- reviewer: `n/a`
- reviewer_target: `n/a`
- reviewer_focus: `n/a`

## Last Update

- timestamp: `2026-03-23 16:12 +09:00`
- note: `Reclassified the active task to remove the obsolete jeju-web mirror commit block and align local hook/guard/docs with the current jeju-spring-centered workflow.`
