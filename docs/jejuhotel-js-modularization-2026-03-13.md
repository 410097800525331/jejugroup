# jejuhotel.js 분해 메모

## 목적

- `front/jejustay/pages/hotel/hotel.js` 단일 파일 해체
- 검색 위젯 중심 로직을 모듈 단위로 분리
- 이후 검색 위젯 컴포넌트화 준비

## 새 구조

- `front/jejustay/pages/hotel/hotel.js`
  - 얇은 엔트리
  - 동적 import로 앱 초기화만 담당
- `front/jejustay/pages/hotel/modules/hotelPageApp.js`
  - 페이지 전체 초기화 조립
- `front/jejustay/pages/hotel/modules/interactions/commonInteractions.js`
  - 위시리스트
  - 기본 스크롤 애니메이션
- `front/jejustay/pages/hotel/modules/interactions/premiumAnimations.js`
  - GSAP 전용 프리미엄 애니메이션
- `front/jejustay/pages/hotel/modules/search/initSearchWidget.js`
  - 검색 위젯 초기화 조립
- `front/jejustay/pages/hotel/modules/search/popupController.js`
  - 팝업 닫기 중앙화
- `front/jejustay/pages/hotel/modules/search/tabs.js`
  - 호텔/액티비티 탭 전환
- `front/jejustay/pages/hotel/modules/search/destinationDropdown.js`
  - 여행지 드롭다운
- `front/jejustay/pages/hotel/modules/search/calendar.js`
  - RangeCalendar 초기화
  - 전역 `JJRangeCalendar` 지연 로드 재시도 포함
- `front/jejustay/pages/hotel/modules/search/guestSelector.js`
  - 인원 선택 팝업
- `front/jejustay/pages/hotel/styles/search-widget.css`
  - 검색 위젯 전용 스타일

## HTML 변경

- `front/jejustay/pages/hotel/jejuhotel.html`
- 검색 위젯 대형 마크업 제거
- `#hotel-search-widget-root` placeholder만 두고 런타임에서 템플릿 주입

## React Island 전환

- `front/components/react/search/types.ts`
  - 공용 search 컴포넌트 타입
- `front/components/react/search/SearchTabs.tsx`
  - 탭 공용 컴포넌트
- `front/components/react/search/SearchDestinationDropdown.tsx`
  - 여행지 드롭다운 공용 컴포넌트
- `front/components/react/search/SearchCalendarPopup.tsx`
  - 캘린더 팝업 공용 컴포넌트
- `front/components/react/search/SearchGuestPopup.tsx`
  - 게스트 팝업 공용 컴포넌트
- `front/components/react/hotel/HotelSearchWidget.tsx`
  - 검색 위젯 루트 JSX 컴포넌트
- `front/components/react/hotel/HotelSearchWidgetContext.tsx`
  - Context + Reducer 기반 상태 관리
  - 탭 전환
  - 여행지 입력값
  - 여행지/게스트/캘린더 팝업 열림값
  - 게스트 카운터
  - 캘린더 표시값 브리지
- `front/components/react/hotel/HotelSearchWidgetTabs.tsx`
  - 탭 JSX 분리
- `front/components/react/hotel/HotelSearchWidgetHotelForm.tsx`
  - 호텔 검색 폼 JSX 분리
- `front/components/react/hotel/HotelSearchWidgetActivityForm.tsx`
  - 액티비티 검색 폼 JSX 분리
- `front/components/react/hotel/HotelSearchWidgetDestinationDropdown.tsx`
  - 여행지 드롭다운 JSX 분리
- `front/components/react/hotel/HotelSearchWidgetCalendarPopup.tsx`
  - 캘린더 팝업 JSX 분리
- `front/components/react/hotel/HotelSearchWidgetGuestPopup.tsx`
  - 게스트 팝업 JSX 분리
- `front/components/react/hotel/searchWidgetData.ts`
  - 검색 위젯 정적 데이터 분리
- `front/components/react/hotel/HotelSearchWidgetIsland.tsx`
  - 검색 위젯을 React island로 마운트
- `front/apps/shell/src/runtime/pages/hotelSearchWidget.tsx`
  - shell runtime 마운트 진입점 추가
- `front/apps/shell/src/runtime/index.ts`
  - 호텔 검색 위젯 island export 추가
- `front/apps/shell/scripts/write-runtime-bootstrap.mjs`
  - `#hotel-search-widget-root` 감지 후 island mount

정리 결과

- `hotel.js` 는 검색 위젯 렌더 책임 제거
- 기존 페이지 스크립트는 본문 인터랙션과 애니메이션만 담당
- 검색 위젯은 템플릿 문자열이 아니라 JSX 컴포넌트 집합으로 렌더
- 검색 위젯 내부 동작 대부분은 React reducer로 이동
- 남은 imperative 브리지는 RangeCalendar 엔진 연결부만 유지
- 여행지 드롭다운, 캘린더 팝업, 게스트 팝업, 탭은 공용 search 컴포넌트 레이어로 분리
- 향후 `jejustay_life` 같은 다른 페이지에서도 같은 공용 search 컴포넌트 조합 재사용 가능

## CSS 분리

- `front/jejustay/pages/hotel/hotel.css`
  - 공통 토큰, reset, shared section typography, import 허브 역할만 유지
- 신규 분리 파일
  - `front/jejustay/pages/hotel/styles/hero-section.css`
  - `front/jejustay/pages/hotel/styles/promo-section.css`
  - `front/jejustay/pages/hotel/styles/destinations-section.css`
  - `front/jejustay/pages/hotel/styles/deals-section.css`
  - `front/jejustay/pages/hotel/styles/search-widget.css`

결과

- `hotel.css` 줄 수 약 `762 -> 180`
- 본문 섹션 스타일과 검색 위젯 스타일 경계가 생겨 이후 수정 난이도 크게 감소

## 메모

- HTML 스크립트 경로는 그대로 `./hotel.js`
- `hotel.js` 만 얇은 loader 역할로 유지해서 기존 페이지 진입점은 안 바꿈
- 검색 위젯 로직이 독립되어 다음 단계에서 React 컴포넌트나 island로 옮기기 쉬워진 흐름
- 검색 위젯 스타일도 `hotel.css` 에서 분리되어 본문 섹션 스타일과 경계가 생김
