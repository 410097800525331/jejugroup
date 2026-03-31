# jejuair cs route unification

- `front/apps/cs` 를 고객센터 단일 원본으로 유지한다.
- `SERVICES.AIR.CS.CUSTOMER_SERVICE` 는 `/pages/cs/customer_center.html` 로 연결한다.
- `SERVICES.AIR.CS.NOTICE` 는 `/pages/cs/customer_center.html#/notices` 로 연결한다.
- `front/jejuair/pages/cs/customerService.html`, `front/jejuair/pages/cs/notic.html` 레거시 엔트리는 제거한다.
- 배포 미러 반영은 `pnpm run sync` 또는 `pnpm run prepare:webapp` 로 수행한다.
