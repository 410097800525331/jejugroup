# STATE

## Current Task

- task: `Restore point and coupon stat tones so the hero cards regain their colored icon boxes`
- phase: `implementation`
- scope: `jeju-spring/src/main/java/com/jejugroup/jejuspring/mypage/application/MyPageStatsQueryService.java, STATE.md, MULTI_AGENT_LOG.md`
- verification_target: `보유 포인트 and 사용 가능한 쿠폰 stats are emitted with point/coupon tones again so the existing hero card icon color+border styles apply`

## Route

- route: `Route A`
- reason: `The user reported a concrete visual regression caused by the stats tone payload, and the fix is a single-file backend hotfix in MyPageStatsQueryService that restores point/coupon tones without widening scope.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md, jeju-spring/src/main/java/com/jejugroup/jejuspring/mypage/application/MyPageStatsQueryService.java`
- note: `Keep the fix tightly scoped to the stats tone emitter so the existing point/coupon hero styles start applying again without touching frontend CSS or other mypage query paths.`

## Contract Freeze

- contract_freeze: `frozen`
- status: `frozen`
- path: `in-state`
- revision: `mypage-stat-tone-restore-v1`
- note: `Restore the first two mypage stat items to tone point/coupon instead of wallet so the existing icon background, color, and border styles come back without changing the card structure or label/value text.`

## Reviewer

- reviewer: `assigned`
- reviewer_target: `n/a`
- reviewer_focus: `Route A self-review only; confirm the emitted stat tones are point/coupon again and the backend still compiles.`

## Last Update

- timestamp: `2026-03-28 12:31:30 +09:00`
- note: `Reclassified to a single-file Route A backend hotfix after tracing the missing icon color/border styling to wallet tones still emitted by MyPageStatsQueryService.`
