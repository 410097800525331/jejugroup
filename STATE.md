# STATE

## Current Task

- task: `Normalize auth-page navigation so login/signup/pass pages route to public runtime URLs instead of internal /front-mirror paths`
- phase: `paused`
- scope: `STATE.md, auth page/header/footer navigation sources, optional docs/runtime references`
- verification_target: `auth login/signup/pass pages render from front-mirror as intended and their visible navigation points at public runtime URLs like /index.html and /pages/... rather than internal /front-mirror/... paths`

## Route

- route: `Route B`
- reason: `The auth runtime ownership cutover itself is already complete and pushed, but the next remaining issue is broader runtime navigation drift across auth templates and shared shell/header behavior. This is no longer the old single-file test slice, so the next machine should reopen it with a fresh broader route decision.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md`
- note: `Paused handoff state only. The previous Route A test-followup is complete and already pushed on lsh; the next machine should continue from a fresh route decision for the remaining auth navigation issue.`

## Contract Freeze

- contract_freeze: `Auth page bodies are already cut back to the front source-of-truth via front-mirror. The remaining follow-up is only to normalize visible navigation so end users are sent to public runtime URLs, not internal /front-mirror/... paths.`

- status: `frozen`
- path: `SEED.auth-front-source-cutover-v1.yaml`
- revision: `v1`
- note: `The auth front-source cutover baseline is complete; remaining work is navigation cleanup on top of that baseline.`

- reviewer: `pending`
- reviewer_target: `auth navigation cleanup`
- reviewer_focus: `Make sure auth pages do not leak internal /front-mirror URLs in visible navigation and keep the new auth runtime ownership intact`

## Last Update

- timestamp: `2026-03-24 22:35:00 +09:00`
- note: `Paused for next-machine handoff. Auth runtime ownership cutover, docs alignment, test expectation alignment, local targeted Gradle verification, and lsh push are complete. The next remaining issue observed in the browser is that some auth-page navigation still points at internal /front-mirror/... URLs instead of public runtime paths such as /index.html and /pages/....`
