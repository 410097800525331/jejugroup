# Next Agent Start

1. 먼저 [docs/api-rewrite-plan.json](/D:/lsh/git/jejugroup/docs/api-rewrite-plan.json) 전체를 읽어.
2. 작업 시작 전 `tracks`, `execution_plan`, `waves`를 기준으로 현재 어떤 트랙을 먼저 칠지 정해.
3. 최근에 추가된 `active_user_sessions` / auth heartbeat / admin activeUsers KPI는 보존 대상으로 취급해.
4. 기본 시작점은 `track_admin`이다.
5. `track_admin`과 `track_support_cms`는 병렬 가능, `track_mypage_booking`은 그 다음이다.
6. 구현 시작 전에는 JSON 계획을 기준으로 새 seed/STATE를 다시 고정해.
