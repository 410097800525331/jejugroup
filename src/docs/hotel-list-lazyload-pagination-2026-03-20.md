# hotel-list lazy load / pagination / sidebar 확장 메모

## 목적

- `front/jejustay/pages/hotel/hotel-list.html` 결과 리스트를 초기 viewport 기준으로만 렌더하고, 스크롤 시 추가 카드가 붙는 흐름으로 조정
- 호텔 결과를 페이지당 최대 50개까지만 보여주고, 남은 결과는 `다음 페이지` 버튼과 `현재 / 전체 페이지` 표기로 넘기게 정리
- 히로시마 기준 필터 사이드바를 Agoda 검색 결과 페이지 참고 수준으로 길게 확장

## 프런트 반영

- `front/components/react/hotel/HotelResultList.tsx`
  - IntersectionObserver sentinel 기반 lazy reveal 적용
  - viewport 높이에 맞춰 초기에 필요한 카드 수만 먼저 로드
  - 페이지 요약 배지, 50개 단위 pagination UI 추가
- `front/components/react/hotel/HotelFilterSection.tsx`
  - 옵션 수가 많은 필터 섹션에 `더 보기 / 접기` 추가
- `front/components/react/hotel/HotelFilterSidebar.tsx`
  - Agoda 레이아웃 참고용 `1박당 요금` 섹션 추가
  - dual range slider + 숫자 입력으로 가격 범위 조절 가능
- `front/components/react/hotel/hotelListPageData.ts`
  - 히로시마 mock inventory를 50개 초과로 확장
  - Agoda 스타일 추가 필터 섹션과 `ui-*` 필터 매칭 지원
  - `currentPrice` 기준 가격 필터링 지원
  - server payload를 클라이언트에서 확장 재구성하는 `enhanceHotelListPageData` 추가
- `front/components/react/hotel/HotelListPageIsland.tsx`
  - DOM payload / API 응답 모두 `enhanceHotelListPageData`를 거치도록 조정
- `front/components/react/hotel/HotelCardPremium.tsx`
  - 이미지 `loading="lazy"` / `decoding="async"` 적용
- `front/jejustay/pages/hotel/hotel-list.css`
  - 사이드바 폭, 결과 요약, pagination, 더보기 버튼 스타일 추가

## 동작 기준

- 히로시마 결과는 client mock 기준 2페이지 이상이 보이도록 확장된다
- 서버에서 예전 `hotel-list-page-data` 구조를 보내더라도, island에서 hiroshima 데이터만 확장해서 동일한 UX를 유지한다
- 새로 추가한 legacy-style 필터(`ui-*`, 브랜드, 여행 테마, 침실 수 등)도 클라이언트 필터링에 반영된다
- 리전이 `jeju`, `osaka` 또는 generic region이어도 사이드바 섹션 구조는 히로시마 기준 레이아웃을 유지하고, 지역명/지역 옵션/주변 명소 라벨만 리전에 맞게 바뀐다

## 검증

- `pnpm -C front/apps/shell check`
- `pnpm run lint`
- `pnpm test`
