# FlightSans 통일 메모

## 목적

- 페이지별로 섞여 있던 `Inter`, `Outfit`, `Pretendard`, `Noto Serif KR`, `Segoe UI` 기반 표시 폰트를 `FlightSans` 기준으로 통일

## 반영

- `front/admin/css/theme.css`
  - admin 전용 `@font-face` 추가
  - admin 기본 폰트를 `FlightSans` 기준으로 변경
- `front/admin/pages/dashboard.html`
- `front/admin/pages/cms.html`
- `front/admin/pages/lodging.html`
- `front/admin/pages/members.html`
- `front/admin/pages/reservations.html`
  - `Inter` Google Fonts 로드 제거
- `front/jejustay/pages/hotel/hotel-list.css`
  - body 폰트를 `FlightSans` 기준으로 변경
- `front/jejustay/pages/stay/private_stay.css`
  - 본문/타이틀/서브타이틀 폰트를 `FlightSans` 기준으로 변경
- `front/pages/mypage/mypage.css`
  - `Outfit`/`Noto Sans KR` import 제거
  - `--font-primary`, `--font-display` 를 `FlightSans` 기준으로 변경
- `jeju-spring/src/main/resources/static/assets/css/app.css`
  - Spring 템플릿 공통 CSS에 `@font-face` 추가
  - body 기본 폰트를 `FlightSans` 기준으로 변경

## 메모

- fallback 용도로 `Noto Sans KR` 는 일부 선언에 남겨둠
- 실제 기본 표시 폰트는 전부 `FlightSans` 우선순위로 통일
