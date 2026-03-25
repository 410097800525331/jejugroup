# STATE

## Current Task

- task: `Revert the remaining non-requested Family Sites casing change, then rerun the final parity census and refresh the report against the true current state`
- phase: `completed`
- scope: `STATE.md, front/components/react/layout/FamilyRadialMenu.tsx, derived runtime/mirror outputs, refreshed browser census, and docs/front-parity-census-2026-03-25.md`
- verification_target: `all non-requested UI changes are reverted and the final parity census/report reflect the true post-revert state`

## Route

- route: `Route A`
- reason: `This rollback is a tiny single-source correction plus regenerated outputs and a refreshed read-heavy census/report update. It stays within one narrow authored source slice and does not require parallel implementation ownership.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, front/components/react/layout/FamilyRadialMenu.tsx, docs/front-parity-census-2026-03-25.md`
- note: `Route A single-writer rollback/report slice. Regenerated outputs are expected verification side effects, not separate authored sources.`

## Contract Freeze

- contract_freeze: `The only intended source rollback is restoring the shared footer label from FAMILY SITES back to Family Sites. After that rollback, the browser census and the parity report must be refreshed so they describe the actual current state without relying on my prior ad hoc casing change. No other user-facing copy or runtime behavior may be changed in this slice.`

- status: `frozen`
- path: `n/a`
- revision: `v1`
- note: `Tiny rollback requested directly by the user; no separate seed file is needed.`

- reviewer: `none`
- reviewer_target: `not used`
- reviewer_focus: `not used`

## Last Update

- timestamp: `2026-03-25 18:02:00 +09:00`
- note: `Completed the final cleanup rollback. The non-requested Family Sites casing change was reverted, the final census report was rewritten against the true current state, and the latest exact browser census stands at 44/47 with 12/12 alias redirects matching.`
