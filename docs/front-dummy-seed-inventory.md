# Front Dummy Seed Inventory

## 원칙

- `front`에 명시된 값만 seed 후보로 본다.
- 값이 비어 있거나 정규화 기준이 부족하면 임시 데이터를 만들지 않는다.
- 기존 migration에 이미 들어간 데이터는 중복 seed를 만들지 않고 `already seeded`로 기록한다.

## 분류 요약

| 상태 | 데이터셋 | front 소스 | 목표 테이블 | 판단 |
| --- | --- | --- | --- | --- |
| `already seeded` | 고객센터 공지 | `front/apps/cs/client/src/data/serviceCenterData.ts` | `notices` | `V14__seed_customer_center_master_data.sql`에 이미 반영됨 |
| `already seeded` | 고객센터 FAQ | `front/apps/cs/client/src/data/serviceCenterData.ts` | `faqs` | `V14__seed_customer_center_master_data.sql`에 이미 반영됨 |
| `already seeded` | 고객센터 문의 분류 | `front/apps/cs/client/src/data/serviceCenterData.ts` | `support_categories` | `V14__seed_customer_center_master_data.sql`에 이미 반영됨 |
| `already seeded` | 딜 페이지 쿠폰 | `front/jejustay/pages/deals/deals.js` | `coupons` | `V18__seed_booking_membership_and_voucher_data.sql`에 이미 반영됨 |
| `already seeded` | 바우처/유심 체험 상품 일부 | `front/components/react/mypage/data.ts`, `front/jejustay/pages/deals/deals.js` | `voucher_products`, `voucher_product_benefits` | `V18__seed_booking_membership_and_voucher_data.sql`에 이미 반영됨 |
| `already seeded` | 고객센터형 CMS 기초 데이터 | `front/admin`, `front/apps/cs` 파생 소스 | `cms_pages`, `cms_blocks`, `content_items`, `banner_slots`, `banners`, `exposure_rules` | `V17__seed_cms_and_banner_data.sql`에 이미 반영됨 |
| `already seeded` | 항공/렌터카 인벤토리 샘플 | `front/admin`, `front/jejuair`, `front/jejustay` 파생 소스 | `flight_*`, `rental_*` 계열 | `V19__seed_flight_and_rental_inventory_data.sql`에 이미 반영됨 |
| `seedable now` | 메인 랜딩 멤버십 | `front/index.html` | `membership_plans`, `membership_plan_benefits` | 요금/플랜명/혜택 문구가 명시돼 있어 textual seed 가능 |
| `source-missing` | 호텔 리스트 본문 | `front/components/react/hotel/hotelListPageData.ts` | `hotel_properties`, `hotel_room_types`, `hotel_price_policies`, `hotel_inventory_stocks` | 객실 구조, 재고, 가격정책 코드, 속성 코드가 없음 |
| `source-missing` | 호텔 검색 필터 카운트 | `front/components/react/hotel/searchWidgetData.ts` | 검색 인덱스/집계 테이블 미정 | count 값은 파생 집계라 원본 seed로 보기 어려움 |
| `source-missing` | 딜 카드 본문 | `front/jejustay/pages/deals/deals.js` | 상품/프로모션/노출 테이블 미정 | 상품 코드, 공급자, 유효기간, 도메인 정규화가 부족함 |
| `source-missing` | 항공 메인 특가 카드 | `front/jejuair/js/air_ticketData.js` | `flight_products` 등 | route_code, schedule_code, fare_class가 없음 |
| `source-missing` | 항공 이벤트 배너 | `front/jejuair/js/eventData.js` | `banners`, `exposure_rules`, `content_items` | 슬롯, 노출 위치, 우선순위, 대상 채널 규칙이 없음 |
| `source-missing` | 항공 부가서비스 카드 | `front/jejuair/js/convenienceData.js` | CMS/부가서비스 마스터 미정 | 대상 엔터티와 서비스 코드 연결 규칙이 없음 |
| `source-missing` | 여행 체크리스트 | `front/components/react/travel/travelChecklistData.ts` | CMS 또는 별도 가이드 테이블 미정 | 저장 대상 스키마가 아직 없음 |
| `source-missing` | 라이프 검색 옵션 | `front/components/react/life/lifeSearchWidgetData.ts` | 장기숙박 옵션 테이블 미정 | 옵션 텍스트만 있고 상품/필터 스키마가 없음 |

## 이번 턴에서 실제 seed 가능한 것

### 메인 랜딩 멤버십

- 소스:
  - `front/index.html`
- 이유:
  - 플랜명, 월 가격, 혜택 텍스트가 명시돼 있다.
  - `membership_plans`, `membership_plan_benefits`는 이미 스키마 계약이 있다.
  - 숫자나 정책이 비어 있는 annual 요금은 schema default `0.00`으로 남기면 되고, 혜택은 `text` 타입으로 그대로 저장 가능하다.
- 구현:
  - `V21__seed_landing_membership_from_front.sql`

## 보류 목록

### 호텔 리스트

- `hotelListPageData.ts`에는 호텔명, 위치, badge, 가격, 태그는 있지만 아래가 없다.
- `property_code`
- 객실 타입 코드
- 재고 날짜/수량
- 가격 정책 코드와 기간
- 따라서 `hotel_properties` 일부만 넣고 나머지를 임시 생성하면 더 꼬인다.

### 항공 특가 / 이벤트 / 부가서비스

- `air_ticketData.js`, `eventData.js`, `convenienceData.js`는 전시용 카드 데이터라서 아래가 없다.
- route / schedule / policy / slot / exposure rule / target key
- 그대로 DB에 넣으면 나중에 다시 뜯어고쳐야 한다.

### 딜 카드

- `deals.js`는 카드 렌더링용 값은 충분하지만 운영 DB seed로는 부족하다.
- 상품 코드
- 공급자 키
- 유효기간
- 상품군별 정규화 축
- 일부 이미지는 로컬 상대경로라 저장 정책도 불명확하다.

## 메모

- `front`에 소스가 없으면 이번 인벤토리에서는 일부러 비워 둔다.
- 다음 seed 작업은 `source-missing` 항목별로 필요한 최소 원본 필드를 먼저 정의한 뒤 들어가는 게 맞다.
