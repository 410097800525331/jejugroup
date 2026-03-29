# STATE

## Current Task

- task: `Remove the native exposure-toggle confirmation from admin CMS notices and fix inactive-notice edit hydration while preserving inactive-row visibility and existing pager/search/filter/tab behavior`
- phase: `implementation`
- scope: `front/admin/js/cms.js, jeju-spring/src/main/java/com/jejugroup/jejuspring/admin/web/AdminReadApiController.java, STATE.md, MULTI_AGENT_LOG.md`
- verification_target: `관리자 CMS 공지 탭에서 노출 상태 토글 시 네이티브 알림/확인창이 뜨지 않고, 비노출 전환 후에도 공지는 관리자 목록에 남은 채 상태만 바뀌며, 비노출 공지를 수정 열었을 때 제목/요약/본문이 비지 않은 상태를 유지하고, 중앙 버튼 줄과 그 아래 1/1 표시 구조 및 8개 단위 페이지네이션을 유지해야 한다`

## Route

- route: `Route B`
- reason: `Reviewer found a blocking inactive-notice edit regression because the admin notices read payload drops excerpt/content, so this Route B slice now spans the notices script plus the admin read surface and cannot stay frontend-only.`

## Writer Slot

- owner: `planner`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md`
  - `worker_admin_notice_ops`: `front/admin/js/cms.js, jeju-spring/src/main/java/com/jejugroup/jejuspring/admin/web/AdminReadApiController.java`
- note: `Keep main planner-only; one worker owns the coupled admin notices script plus backend read payload because the blocker is a hydration mismatch across those two files.`

## Contract Freeze

- contract_freeze: `frozen`
- status: `frozen`
- path: `in-state`
- revision: `admin-cms-notice-ops-v5`
- note: `admin CMS 공지 탭의 노출 상태 토글은 클릭 시 네이티브 confirm/alert 없이 동작해야 한다. 비노출 전환 후에도 관리자 목록에서는 항목을 지우지 않고 고객센터 공개 목록에서만 숨겨야 하며, admin read payload는 비노출 row에도 제목/요약/본문 필드를 실어 다시 수정 열었을 때 빈 값으로 덮어쓰지 않게 해야 한다. 8개 단위 페이지네이션은 하단 중앙의 이전/현재페이지/다음 버튼 한 줄과 그 아래 1/1 표시 구조를 유지한다.`

## Reviewer

- reviewer: `assigned_complete`
- reviewer_target: `reviewer_admin_notice_ops`
- reviewer_focus: `Verify the notices tab exposure toggle no longer shows native alert/confirm UI, inactive notices remain visible in the admin list after toggling, inactive notices can still open in edit mode with body fields intact, and the centered pager plus existing search/filter/tab behavior stay intact.`

## Last Update

- timestamp: `2026-03-29 22:36:30 +09:00`
- note: `Admin notices follow-up now removes the native toggle confirm/alert path and enriches `/api/admin/tables/cms` rows with excerpt/content metadata so inactive notices remain editable without blank overwrite risk; reviewer reported no blocking findings.`
