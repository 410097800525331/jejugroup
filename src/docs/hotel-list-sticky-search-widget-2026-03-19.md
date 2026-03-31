# hotel-list sticky search widget 메모

## 목적

- `front/jejustay/pages/hotel/hotel-list.html` 상단 스티키 검색바를 정적 3칸 UI에서 React island 기반 검색 UI로 교체
- `jejuhotel` 검색 위젯이 쓰는 공용 목적지 드롭다운, RangeDatePicker, 투숙 인원 팝업을 재사용
- 검색 submit 시 호텔 리스트 라우트로 `region`, `keyword`, `checkIn`, `checkOut`, `adults`, `children`, `rooms` 쿼리를 전달

## 반영

- `front/components/react/hotel/hotelSearchQuery.ts`
  - 검색 상태 <-> URL 쿼리 변환 유틸 추가
  - 목적지 문자열을 백엔드 친화적인 `region` 코드로 정규화
- `front/components/react/hotel/HotelSearchWidgetContext.tsx`
  - 초기 검색 상태 주입 지원
  - 검색 submit 로직 추가
- `front/components/react/hotel/HotelListSearchBar.tsx`
- `front/components/react/hotel/HotelListSearchWidget.tsx`
- `front/components/react/hotel/HotelListSearchWidgetIsland.tsx`
  - 호텔리스트 스티키 검색바 전용 island 추가
- `front/components/react/hotel/searchWidgetData.ts`
  - `제주`, `다낭`, `싱가포르` 목적지 추가
- `front/apps/shell/src/runtime/pages/hotelListSearchWidget.tsx`
- `front/apps/shell/src/runtime/index.ts`
- `front/apps/shell/src/runtime/bootstrap.js`
  - `hotel-list-search-widget-root` 감지 및 마운트 추가
- `front/jejustay/pages/hotel/hotel-list.html`
  - 기존 정적 `search-item-mini` 블록 제거
  - `hotel-list-search-widget-root` placeholder 추가
- `front/jejustay/pages/hotel/hotel-list.css`
  - 스티키 검색바 안에서 island가 자연스럽게 보이도록 레이아웃/버튼/popup 스타일 오버라이드

## 검증

- `pnpm run check:shell`
- `pnpm run build:shell`
- `pnpm run smoke:front`
  - 10개 통과
  - `main landing customer center link routes to bundled customer center page` 1개 실패
  - 실패 원인: `#root` 미노출로 고객센터 번들 페이지 smoke 실패, 이번 hotel-list 변경 범위와는 무관
