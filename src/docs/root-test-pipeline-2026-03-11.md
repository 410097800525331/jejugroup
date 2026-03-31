# Root Test Pipeline

## 목적

- 루트 `pnpm test` placeholder 제거
- 프론트 라우트 스캔과 앱 검증을 루트 스크립트로 고정
- smoke 검증은 별도 스크립트로 분리

## 스크립트 구성

- `pnpm run scan:routes`
  - `front/scripts/scan_hardcoded_routes.js`
- `pnpm run lint`
  - `guard:text`
  - 라우트 스캔
  - `check:shell`
  - `check:cs`
- `pnpm run test`
  - `lint`
  - `build:shell`
  - `build:cs`
- `pnpm run test:smoke`
  - `smoke:cs`
  - `smoke:front`

## 메모

- `build:shell` 실행 시 `front/components/runtime/shell-runtime.js` 갱신
- `build:cs` 실행 시 `front/pages/cs/customer_center.html` 및 asset 산출물 갱신
- 프런트 smoke 는 기존 인코딩 오염 스펙을 건드리지 않고 `front-entrypoints.runtime.spec.cjs` 로 분리
- air shell footer 검증은 실제 런타임 마크업 기준으로 `(주) 제주항공` 헤더를 확인

## 확인 결과

- `pnpm run lint`
- `pnpm test`
- `pnpm run test:smoke`
