# STATE

## Current Task

- task: `Fix landing language-toggle DOM collapse found during runtime smoke`
- phase: `complete`
- scope: `shared front i18n bridge plus landing fallback language application`
- verification_target: `Playwright landing language smoke plus pnpm run check:shell, node --check front/core/constants/front-i18n.js, node --check front/core/pages/landing/main.js, pnpm run guard:text`

## Route

- route: `Route B`
- reason: `The runtime smoke failure can involve landing code plus shell/layout runtime consumers across multiple write-owned slices, so Route B and delegated review stay required while the existing frozen language-state contract remains the reference.`

## Writer Slot

- owner: `main`
- write_set: `STATE.md, MULTI_AGENT_LOG.md`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md`
  - `worker_seed`: `SEED.front-language-state-unification-v1.yaml`
  - `worker_shared_i18n`: `front/core/constants/front-i18n.js`
  - `worker_feature_landing`: `front/core/pages/landing/main.js`
  - `reviewer_front_language_state`: `review-only across the shared bridge, landing, and shell slices`
- note: `Root cause confirmed during runtime smoke: updateDocumentLang writes data-lang onto body, then the next [data-lang] translation pass treats body itself as a translation target and replaces the whole body with "en". The frozen seed stays active while workers patch the shared bridge and the landing fallback mirror of that logic.`

## Contract Freeze

- contract_freeze: `Frozen on 2026-03-23 20:35:38 +09:00 via SEED.front-language-state-unification-v1.yaml`

## Seed

- status: `frozen`
- path: `SEED.front-language-state-unification-v1.yaml`
- revision: `1`
- note: `The frozen seed locks landing language authority on front-i18n, shell language synchronization through the same bridge, and front/index.html load ordering before worker implementation starts.`

## Reviewer

- reviewer: `reviewer_front_language_state`
- reviewer_target: `front language bridge correctness across landing, shell, FAB, chatbot, and script load ordering`
- reviewer_focus: `front-i18n persistence authority, landing toggle sync, shell fallback safety, FAB/chatbot sync, custom event compatibility, initial translation timing, and no mirror-boundary violations`

## Last Update

- timestamp: `2026-03-23 21:15:36 +09:00`
- note: `Bugfix complete. shared front-i18n and the landing fallback now keep current language on body via data-current-lang and exclude html/body carriers from [data-lang] translation scans, pnpm run check:shell plus both node checks and pnpm run guard:text passed, the custom Playwright landing language smoke passed, the official main landing smoke passed again, and reviewer_front_language_state finished with 발견 없음.`
