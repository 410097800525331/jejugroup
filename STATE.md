# STATE

## Current Task

- task: `Raise Spring multipart limits to match the avatar upload 5MB contract`
- phase: `implementation`
- scope: `jeju-spring/src/main/resources/application.yml, STATE.md`
- verification_target: `POST /api/mypage/avatar no longer fails at the Spring multipart layer for payloads within the intended 5MB limit`

## Route

- route: `Route A`
- reason: `The user reported a concrete 413 multipart limit mismatch, and the fix is a tight one-file Spring config hotfix that stays within a single write lane.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, jeju-spring/src/main/resources/application.yml`
- note: `Keep the fix to Spring multipart sizing only and avoid unrelated source or mirror edits in this slice.`

## Contract Freeze

- contract_freeze: `frozen`
- status: `frozen`
- path: `in-state`
- revision: `avatar-multipart-limit-hotfix-v1`
- note: `Set Spring servlet multipart max-file-size and max-request-size to 5MB so the backend transport limit matches the existing avatar validation contract without changing the frontend editor or upload API shape.`

## Reviewer

- reviewer: `n/a`
- reviewer_target: `n/a`
- reviewer_focus: `Route A self-review only; confirm the new multipart limits match the intended 5MB avatar policy and do not change unrelated runtime behavior.`

## Last Update

- timestamp: `2026-03-28 05:14:00 +09:00`
- note: `Reclassified from the completed sync slice to a one-file Route A Spring multipart limit hotfix for avatar uploads.`
