# Admin Access Rules

## 목적

- 관리자 화면 접근 판정을 한 군데 규칙으로 맞춘다
- 로컬 개발 관리자와 실제 관리자 권한 세션을 같은 흐름으로 처리한다

## 현재 규칙

- `resolveAdminSession` 이 관리자 세션을 만들 수 있으면 관리자 페이지 접근 허용
- 우선순위는 저장된 `userSession` 의 관리자 권한 판별
- 저장된 관리자 세션이 없으면 로컬 개발 호스트에서만 로컬 관리자 세션 fallback 사용
- 로컬 개발 호스트는 loopback, private IPv4, `.local`, 단일 호스트명 환경을 포함한다
- 관리자 페이지 스크립트는 `window.AdminAuth.waitForAdminSession` 이후에만 초기화한다
