# Admin Sidebar Navigation

## 목적

- 관리자 페이지 사이 이동 뒤에도 사이드바 열림값을 유지한다
- 첫 렌더 시점에도 현재 뷰포트 기준으로 같은 표시 흐름을 적용한다

## 현재 규칙

- 저장된 값이 있으면 `adminSidebarOpen` 을 우선 사용
- 저장된 값이 없으면 데스크톱은 열림, 모바일은 닫힘으로 시작
- 관리자 개별 페이지는 `window.AdminSidebarUI.applySidebarUI` 로 첫 렌더와 구독 갱신을 같은 방식으로 맞춘다
