# front/components React 전환 Wave 5.5

## 목적
- `front/components/adapters/*` 의존 제거
- 페이지별 컴포넌트 초기화를 `components/runtime/bootstrap.js` 단일 진입으로 통합
- 레거시 CSS 경로를 React 경로로 정리

## 변경 사항
- 신규 런타임 부트스트랩 추가
  - `front/components/runtime/bootstrap.js`
  - main/hotel shell mount, FAB/chatbot/weather 초기화를 DOM 기준으로 자동 수행
  - `front/apps/shell/scripts/write-runtime-bootstrap.mjs`로 build 후 자동 생성
- HTML 스크립트 컷오버
  - 기존 `components/adapters/*` 스크립트 참조 제거
  - `components/runtime/bootstrap.js` 모듈 스크립트로 치환
- 레이아웃 CSS 경로 컷오버
  - `components/assets/layout/header/header.css` -> `components/react/layout/header.css`
  - `components/assets/layout/mega_menu/mega-menu.css` -> `components/react/layout/mega-menu.css`
- React 레이아웃 CSS 추가
  - `front/components/react/layout/header.css`
  - `front/components/react/layout/mega-menu.css`
- 어댑터 활성 파일 제거
  - `front/components/adapters/layout/*.js`
  - `front/components/adapters/ui/*.js`
  - `front/components/adapters/widget/*.js`
- 런타임 루트 계산 정리
  - `front/apps/shell/src/runtime/utils/appRoot.ts`
  - `front/core/utils/app_bootstrap.js`
- 빌드 스크립트 갱신
  - `front/apps/shell/package.json`의 `build` 스크립트에 bootstrap 생성 단계 추가

## 검증
- `corepack pnpm --dir front/apps/shell check` 통과
- `corepack pnpm --dir front/apps/shell build` 통과
- `corepack pnpm lint` 실패 (lint script 미정의)
- `corepack pnpm test` 실패 (루트 test script가 의도적으로 `exit 1`)
- `front/backup` SHA256 중복 검사 0건
