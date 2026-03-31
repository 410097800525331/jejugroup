# jejuhotel React RangeDatePicker 전환 메모

## 목적

- `jejuhotel` 검색 위젯 안의 `JJRangeCalendar` 브리지 제거
- 캘린더 열기/닫기, visibleMonth, hoverDate, temp range, confirm range를 전부 React reducer 기반으로 이동
- 기존 검색 위젯 디자인과 팝업 레이아웃은 최대한 유지
- 이후 `jejustay_life` 에 재사용할 수 있게 공용 search 레이어에 range picker 계산 로직 정리

## 이번 반영 범위

### 공용 search 레이어

- `front/components/react/search/types.ts`
  - 공용 캘린더 탭, range picker state, month/day view 타입 추가
- `front/components/react/search/rangeDatePicker.ts`
  - 날짜 정규화
  - visibleMonth 이동
  - range 선택 규칙
  - hover preview 계산
  - 월별 달력 view model 생성
- `front/components/react/search/SearchCalendarPopup.tsx`
  - 기존 DOM placeholder 렌더링 제거
  - 월/요일/일자 셀을 React에서 직접 렌더링
  - 캘린더 탭, flexible 탭, clear, confirm, hover preview, range 강조를 props 기반으로 처리

### jejuhotel 검색 위젯

- `front/components/react/hotel/HotelSearchWidgetContext.tsx`
  - 캘린더 브리지 초기화 제거
  - `hoverDate`, `tempCheckIn`, `tempCheckOut`, `checkIn`, `checkOut`, `visibleMonth`, flexible tab/value 를 reducer로 관리
  - 팝업 닫기 시점에 confirm 닫기와 discard 닫기를 분리
- `front/components/react/hotel/HotelSearchWidgetCalendarPopup.tsx`
  - Sunday first
  - 한글 요일
  - `YYYY년 M월` 캡션 포맷 적용
- `front/components/react/hotel/HotelSearchWidgetHotelForm.tsx`
  - 브리지 전용 hidden field 제거

### 스타일

- `front/jejustay/pages/hotel/styles/search-widget.css`
  - React 버튼 셀에도 기존 원형 강조, range 배경, hover preview가 그대로 보이게 버튼 reset 추가

## 유지한 것

- 현재 주황 포인트 톤
- 흰 배경 팝업
- 체크인/체크아웃 원형 강조
- 기존 캘린더 2개월 레이아웃
- 기존 탭 버튼 비주얼
- 여행지 드롭다운, 게스트 팝업, 검색 바 레이아웃

## 범위 밖

- `front/apps/shell/src/runtime/ui/rangeCalendar.ts`
- `window.JJRangeCalendar`
- `jejustay_life` / `private_stay` 레거시 페이지 캘린더 연결

이번에는 `jejuhotel` React island 의존만 제거함
레거시 페이지는 아직 전역 range calendar 를 쓰므로 그대로 둠

## 검증

- `pnpm run check:shell`
- `pnpm test`
- `pnpm run smoke:front`
- `pnpm dlx @playwright/test test scripts/smoke/_tmp_calendar_toggle_close.spec.cjs --reporter=list`
