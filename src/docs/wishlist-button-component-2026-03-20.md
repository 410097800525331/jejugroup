# Wishlist Button Shared Component

## 목적

- `jejustay_life`, `jejuhotel`, `private_stay`, `activities`에 흩어져 있던 `wishlist-btn` 로직과 스타일을 공통 컴포넌트 유틸로 통합
- 클릭 시 단순 토글 대신 할로, 스파크, 탄성 모션이 포함된 프리미엄 인터랙션으로 개선

## 공통 소스

- 스크립트: `front/jejustay/shared/wishlist-button.js`
- 스타일: `front/jejustay/shared/wishlist-button.css`

## 적용 페이지

- `front/jejustay/pages/hotel/jejuhotel.html`
- `front/jejustay/pages/stay/jejustay_life.html`
- `front/jejustay/pages/stay/private_stay.html`
- `front/jejustay/pages/travel/activities.html`

## 메모

- 호텔 메인/프라이빗/액티비티 페이지는 공통 버튼 유틸의 기본 토글 모드 사용
- `jejustay_life`는 기존 `FABState` 위시리스트 흐름을 유지하면서 버튼만 공통 컴포넌트로 교체
- 정적 페이지 버튼은 카드 DOM에서 제목, 위치, 이미지, 가격을 읽어 FAB `PICK` 저장소에 넣는다
- React 호텔 카드도 공통 버튼 컴포넌트를 통해 FAB `PICK` 저장소와 직접 동기화된다
- `wishlist-btn-premium`은 React 공통 `WishlistButton`으로 대체됨
