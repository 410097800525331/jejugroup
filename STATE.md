# STATE

## Current Task

- task: `Align JejuSpringApplicationTests with the auth front-mirror alias cutover`
- phase: `implementation`
- scope: `STATE.md, jeju-spring/src/test/java/com/jejugroup/jejuspring/JejuSpringApplicationTests.java`
- verification_target: `Spring application tests no longer assume /auth/* returns the old temporary auth HTML directly and instead verify the new alias + front-mirror ownership contract`

## Route

- route: `Route A`
- reason: `The remaining slice is now a single-file test expectation adjustment in JejuSpringApplicationTests.java after the runtime controllers and docs are already updated. No shared assets, no additional docs, and no second implementation lane are needed for this narrow follow-up.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, jeju-spring/src/test/java/com/jejugroup/jejuspring/JejuSpringApplicationTests.java`
- note: `Route A single-writer follow-up. The auth front-source cutover contract is already frozen; this slice only updates Spring test expectations to match that runtime behavior.`

## Contract Freeze

- contract_freeze: `Keep the auth front-source cutover behavior unchanged. /auth/login, /auth/signup, and /auth/pass are compatible aliases, and /pages/auth/*.html is the canonical front-mirror rendered path. Update tests only so they assert that contract instead of the old temporary Spring auth templates.`

- status: `frozen`
- path: `SEED.auth-front-source-cutover-v1.yaml`
- revision: `v1`
- note: `Frozen auth front-source cutover contract still applies to this test-only follow-up.`

- reviewer: `not required for Route A`
- reviewer_target: `n/a`
- reviewer_focus: `n/a`

## Last Update

- timestamp: `2026-03-24 21:36:00 +09:00`
- note: `Route A follow-up starts now because the only remaining gap is JejuSpringApplicationTests still assuming /auth/* returns the old temporary auth HTML directly.`
