# Next Agent Start

1. 먼저 [docs/api-rewrite-plan.json](D:\lsh\git\jejugroup\docs\api-rewrite-plan.json)을 읽어. 기본 순서는 그대로 `track_admin` -> `track_support_cms` -> `track_mypage_booking`이다.
2. 최근 작업 보존 조건부터 기억해.
   - `active_user_sessions`
   - auth heartbeat
   - admin dashboard `activeUsers` KPI
3. 이번 workspace에서 이미 끝낸 admin 진행분은 아래다.
   - dashboard KPI 정상화: [SEED.admin-dashboard-kpi-realign-v1.yaml](D:\lsh\git\jejugroup\docs\seeds\SEED.admin-dashboard-kpi-realign-v1.yaml)
   - dashboard recentActivity 정상화: [SEED.admin-dashboard-recent-activity-realign-v1.yaml](D:\lsh\git\jejugroup\docs\seeds\SEED.admin-dashboard-recent-activity-realign-v1.yaml)
   - dashboard chartSeriesByRange 실데이터화: [SEED.admin-dashboard-chart-series-realign-v1.yaml](D:\lsh\git\jejugroup\docs\seeds\SEED.admin-dashboard-chart-series-realign-v1.yaml)
   - members surface `membership` 탭 정렬: [SEED.admin-members-surface-membership-tab-v1.yaml](D:\lsh\git\jejugroup\docs\seeds\SEED.admin-members-surface-membership-tab-v1.yaml)
   - cms surface `banner` 탭 정렬: [SEED.admin-cms-surface-banner-tab-v1.yaml](D:\lsh\git\jejugroup\docs\seeds\SEED.admin-cms-surface-banner-tab-v1.yaml)
   - reservations surface `booking` 탭 실데이터화: [SEED.admin-reservations-surface-booking-tab-v1.yaml](D:\lsh\git\jejugroup\docs\seeds\SEED.admin-reservations-surface-booking-tab-v1.yaml)
4. 현재 핵심 구현 파일은 [AdminReadApiController.java](D:\lsh\git\jejugroup\jeju-spring\src\main\java\com\jejugroup\jejuspring\admin\web\AdminReadApiController.java) 하나다. admin read 쪽 실제 진척은 여기에 몰려 있다.
5. `track_admin`에서 남은 우선순위는 이 순서로 치면 된다.
   - `/api/admin/tables/reservations`의 `payment`, `refund`, `traveler` 탭을 schema 상태판에서 real query rows로 전환
   - `/api/admin/tables/lodging`를 schema 상태판에서 real product/query rows로 전환
   - 그 다음에야 `/api/admin/tables/{surface}` 내부 분기를 surface별 query service 구조로 쪼개는 seed를 따는 게 맞다
6. admin 이후 남은 트랙은 그대로다.
   - `track_support_cms`: support ticket/comment/attachment + customer-center notice/faq 내부 분리
   - `track_mypage_booking`: mypage snapshot과 booking read 공통 query 계층 정리
7. 새 workspace에서 구현 재개할 때는 바로 코드부터 건들지 말고, 남은 slice 하나를 고른 뒤 새 seed/STATE를 다시 고정해.
8. 백엔드 검증은 wrapper 말고 아래 명령을 써.
   - `D:\lsh\git\jejugroup\.codex-temp\gradle-8.14.4\bin\gradle.bat compileJava`
9. 지금 worktree는 local changes가 남아 있다. fresh workspace에서 같은 상태를 이어야 하면 아래 파일들을 기준으로 진행해.
   - [STATE.md](D:\lsh\git\jejugroup\STATE.md)
   - [NEXT_AGENT_START.md](D:\lsh\git\jejugroup\NEXT_AGENT_START.md)
   - [AdminReadApiController.java](D:\lsh\git\jejugroup\jeju-spring\src\main\java\com\jejugroup\jejuspring\admin\web\AdminReadApiController.java)
   - 위에 적은 `SEED.admin-*.yaml` 파일들
