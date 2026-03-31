# 호텔 리스트 관리자 오퍼 제어

## 변경 목적

- 호텔 리스트 카드 이미지 위 배지 문구와 카드 가격을 관리자 화면에서 직접 수정할 수 있게 연결
- 기존 정적 목업 데이터 위에 관리자 오버라이드를 덮어쓰는 방식으로 구현

## 적용 범위

- 관리자 화면: `front/admin/pages/lodging.html`
- 관리자 로직: `front/admin/js/lodging.js`
- 관리자 기본 카탈로그: `front/admin/data/hotel-list-offer-catalog.json`
- 호텔 리스트 반영 로직: `front/components/react/hotel/HotelListPageIsland.tsx`
- 호텔 카드 렌더: `front/components/react/hotel/HotelCardPremium.tsx`
- 오버라이드 헬퍼: `front/components/react/hotel/hotelListOfferOverrides.ts`

## 동작 방식

1. 관리자 `lodging` 화면 아래쪽의 `호텔 리스트 혜택/가격 노출 관리` 섹션에서 호텔을 선택한다.
2. 배지 문구, 정상가, 판매가를 수정 후 저장한다.
3. 저장값은 브라우저 `localStorage` 키 `jejuHotelListOfferOverridesV1` 에 기록된다.
4. 호텔 리스트 React island 가 로드될 때 해당 오버라이드를 읽어 기본 데이터에 덮어쓴다.
5. 배지 문구를 빈 값으로 저장하면 카드 이미지 위 배지가 숨겨진다.

## 현재 제약

- 백엔드 CMS/API 연동이 아니라 프런트 단의 로컬 저장 방식이다.
- 따라서 같은 브라우저 저장소를 쓰는 환경에서만 수정값이 유지된다.
- 서버 공용 데이터로 승격하려면 추후 관리자 저장 API와 호텔 리스트 조회 응답 계약을 별도로 고정해야 한다.
