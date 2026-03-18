# front/components React 전환 Wave 5

## 목적
- `front/components`에 남아 있던 HTML 템플릿 의존 경로를 React 컴포넌트 경로로 전환
- `front/components/react`를 FAB 전용 폴더에서 레이아웃/위젯/UI 공용 소스 폴더로 확장

## 변경 내용
- 새 React 컴포넌트 추가
  - `front/components/react/layout/MainHeaderTemplate.tsx`
  - `front/components/react/layout/HotelHeaderTemplate.tsx`
  - `front/components/react/layout/MainFooterTemplate.tsx`
  - `front/components/react/layout/HotelMegaMenuItem.tsx`
  - `front/components/react/layout/hotelHeaderData.ts`
  - `front/components/react/ui/reservationDrawer/ReservationDrawerMarkup.tsx`
  - `front/components/react/widget/ChatbotPanel.tsx`

- shell runtime 연결 변경
  - `front/apps/shell/src/runtime/layout/shellMount.tsx`
    - HTML fetch(`components/assets/layout/*.html`) 제거
    - React 컴포넌트 직접 렌더링으로 변경
  - `front/apps/shell/src/runtime/ui/drawer.ts`
    - HTML fetch(`components/assets/ui/reservation_drawer/drawer.html`) 제거
    - React 마크업 렌더링으로 변경
  - `front/apps/shell/src/runtime/widget/chatbot.tsx`
    - runtime 내부 패널 대신 `front/components/react/widget/ChatbotPanel.tsx` 사용

- 빌드 설정 정리
  - `front/apps/shell/tsconfig.json`에 `@front-components/*` path alias 추가
  - `front/apps/shell/vite.config.ts`에 `@front-components` alias 및 fs allow 추가

- 활성 경로 정리
  - `front/apps/shell/src/runtime/components/layout/HtmlTemplate.tsx`
  - `front/apps/shell/src/runtime/components/widget/ChatbotPanel.tsx`
  - `front/apps/shell/src/runtime/utils/template.ts`

## 호환성 메모
- 기존 `front/components/assets/**/*.html` 파일은 일부 레거시 경로(`mypage` 쉘)에서 아직 직접 사용하므로 유지
- 즉시 삭제하면 `front/pages/mypage/dashboard_shell.js` 경로가 깨질 수 있음

## Wave 5.1
- `front/pages/mypage/dashboard_shell.js` switched to React runtime mounting
  - `main` shell now mounts via `mountMainShellRuntime()`
  - `stay` shell now mounts via `mountHotelShellRuntime()`
  - legacy `fetch(...header.html/footer.html)` path removed
- legacy snapshot stored at
  - `front/backup/legacy-pages/mypage/dashboard_shell.js`

## Wave 5.2
- moved legacy CSS from `components/assets` to React-side paths
  - `components/react/ui/FAB/fab.css`
  - `components/react/ui/reservationDrawer/drawer.css`
  - `components/react/widget/chatbot-style.css`
  - `components/react/widget/weather.css`
- updated all in-repo references to new paths
- removed legacy source CSS files under `components/assets`
- kept legacy snapshots in `front/backup/legacy-components/*`
