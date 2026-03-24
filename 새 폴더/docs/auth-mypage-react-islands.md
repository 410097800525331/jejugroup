# Auth Mypage React Island 전환 기록

## 대상

- `front/pages/auth/login.html`
- `front/pages/mypage/dashboard.html`
- `front/components/react/auth/*`
- `front/components/react/mypage/*`
- `front/apps/shell/src/runtime/pages/*`

## 적용 방식

- 페이지 셸은 기존 정적 HTML 유지
- 실제 폼과 대시보드 본문만 React island로 마운트
- 셸 마운트는 기존 `dashboard_shell.js`를 브리지로 유지
- `front/jejuair` 경로는 이번 작업에서 제외

## 변경 요약

- 로그인 폼을 React 컴포넌트로 전환
  - 유효성 검사
  - 로그인 요청
  - 세션 저장
  - 라우팅 이동
- 마이페이지 대시보드를 React 컴포넌트로 전환
  - 요약 자산 카드
  - 예약 목록 필터
  - 고객 지원 블록
- 공통 UI 조각을 `front/components/react` 아래로 분리
- shell runtime bootstrap이 `jeju-login-app`, `mypage-dashboard-root`를 감지하면 자동 마운트

## 검증

```bash
corepack pnpm --dir front/apps/shell check
corepack pnpm --dir front/apps/shell build
corepack pnpm dlx @playwright/test test scripts/smoke/cs-customer-center.smoke.spec.cjs scripts/smoke/front-entrypoints.smoke.spec.cjs --reporter=list
```

## 후속 후보

- `signup.html` 단계 UI React 전환
- `pass_auth.html` 단계 UI React 전환
- `mypage` 세부 패널 데이터 API 연결
