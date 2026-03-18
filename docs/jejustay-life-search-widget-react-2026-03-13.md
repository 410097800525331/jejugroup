# jejustay_life 검색 위젯 React 이관 메모

## 목적

- `jejustay_life.html` 검색바를 React island로 전환
- 기존 공용 search 컴포넌트 재사용
  - 여행지 드롭다운
  - 게스트 팝업
  - RangeDatePicker 기반 캘린더
- life 페이지 전용 차이인 `필수 옵션`만 별도 공용 팝업 컴포넌트로 추가
- 아래 장기 체류 리스트 렌더링 로직은 기존 `jejustay_life.js`를 유지하고, 검색 결과만 커스텀 이벤트로 연결

## 반영

- `front/components/react/search/SearchOptionsPopup.tsx`
  - 체크박스 기반 필수옵션 팝업 공용 컴포넌트 추가
- `front/components/react/life/*`
  - life 검색 위젯 전용 context / data / popup wrapper / island 추가
  - 여행지 드롭다운은 `jejuhotel`이 쓰는 공용 데이터/컴포넌트를 그대로 사용
- `front/apps/shell/src/runtime/pages/lifeSearchWidget.tsx`
  - life 검색 위젯 island 마운트 추가
- `front/apps/shell/src/runtime/index.ts`
- `front/apps/shell/scripts/write-runtime-bootstrap.mjs`
  - `life-search-widget-root` 감지 및 런타임 부트스트랩 연결
- `front/jejustay/pages/stay/jejustay_life.html`
  - 기존 검색바 하드코딩 제거
  - `life-search-widget-root` placeholder로 교체
- `front/jejustay/pages/stay/jejustay_life.js`
  - 레거시 검색바 초기화 제거
  - `jeju:life-search-submit` 이벤트를 받아 기존 호텔 리스트 필터에 연결
- `front/jejustay/pages/stay/jejustay_life.css`
  - React 위젯용 옵션 팝업 스타일만 유지
  - 드롭다운 / 캘린더 / 게스트 팝업에 덮어쓰던 page-specific 스타일 제거
- `front/jejustay/pages/hotel/styles/search-widget.css`
  - 옵션 팝업 기본 스타일과 경고 텍스트 스타일을 공용 레이어로 승격

## 결과

- `jejustay_life` 검색바는 React로 렌더됨
- 필수옵션은 별도 컴포넌트로 분리됨
- 검색 버튼 클릭 시 기존 장기 체류 카드 리스트 필터링은 계속 동작함
- 기존 page-level 콘텐츠와 카드 렌더링 로직은 그대로 유지됨

## 검증

- `pnpm run check:shell`
- `pnpm run build:shell`
- `pnpm run smoke:front`
- 임시 Playwright로 `jejustay_life.html`에서 필수옵션 팝업 열림과 카드 필터링 확인 후 스펙 삭제
- 임시 Playwright로 `jejustay_life.html`에서 공용 여행지 / 캘린더 / 게스트 팝업 열림 확인 후 스펙 삭제
