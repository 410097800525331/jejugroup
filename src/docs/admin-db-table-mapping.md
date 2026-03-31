# admin DB table mapping

기준:
- `front/admin/pages/*.html`
- `front/admin/js/*.js`
- 현재 테이블명과 제안/적용 테이블명은 기본적으로 동일 유지

## 1. 화면-테이블 매핑

| front 경로 | admin 탭/기능 | 현재 테이블명 | 제안/적용 테이블명 | 테이블 comment 요지 |
| --- | --- | --- | --- | --- |
| `front/admin/pages/dashboard.html` / `front/admin/js/dashboard.js` | 총괄 대시보드 | `bookings`, `booking_items`, `booking_passengers`, `payment_transactions`, `payment_refunds`, `users`, `admin_action_logs` | 동일 유지 | 예약, 결제, 환불, 회원, 운영 로그를 모아 집계하는 공통 소스다. 별도 대시보드 스냅샷 테이블은 없다. |
| `front/admin/pages/reservations.html` / `front/admin/js/reservations.js` | 예약 | `bookings`, `booking_items`, `booking_passengers` | 동일 유지 | 예약 본문, 예약 상품 항목, 예약 트리의 승객 정보를 담는 공통 예약 테이블이다. |
| `front/admin/pages/reservations.html` / `front/admin/js/reservations.js` | 결제 | `payment_transactions` | 동일 유지 | 결제 거래 이력을 저장하는 테이블이다. |
| `front/admin/pages/reservations.html` / `front/admin/js/reservations.js` | 환불 | `payment_refunds` | 동일 유지 | 결제 환불 이력을 저장하는 테이블이다. |
| `front/admin/pages/reservations.html` / `front/admin/js/reservations.js` | 여행자/탑승객 | `booking_passengers`, `travel_events` | 동일 유지 | 예약에 붙는 탑승객 정보와 일정/활동 내역을 저장한다. `flight_passengers`로 쪼개지지 않는다. |
| `front/admin/pages/lodging.html` / `front/admin/js/lodging.js` | 숙소 | `properties`, `property_room_types`, `property_benefits`, `property_display_overrides`, `property_tags`, `price_policies` | 동일 유지 | 숙소 마스터, 객실 타입, 부대 혜택, 노출 오버라이드, 태그, 가격 정책을 저장한다. |
| `front/admin/pages/lodging.html` / `front/admin/js/lodging.js` | 항공 | `flight_routes`, `flight_schedules`, `flight_fare_policies`, `flight_seat_inventories` | 동일 유지 | 항공 노선, 운항 스케줄, 운임 정책, 좌석 재고를 저장한다. |
| `front/admin/pages/lodging.html` / `front/admin/js/lodging.js` | 렌터카 | `rental_locations`, `rental_vehicle_classes`, `rental_vehicles`, `rental_rate_policies`, `rental_vehicle_inventories` | 동일 유지 | 렌터카 지점, 차량 등급, 차량, 요금 정책, 재고를 저장한다. |
| `front/admin/pages/lodging.html` / `front/admin/js/lodging.js` | 바우처 | `voucher_products`, `voucher_product_benefits` | 동일 유지 | 바우처 상품과 상품 혜택을 저장한다. |
| `front/admin/pages/lodging.html` / `front/admin/js/lodging.js` | 특가/쿠폰 | `coupons`, `user_coupons` | 동일 유지 | 쿠폰 마스터와 사용자 발급 쿠폰 이력을 저장한다. |
| `front/admin/pages/lodging.html` / `front/admin/js/lodging.js` | 유심 | `voucher_products`, `voucher_product_benefits` | 동일 유지 | 유심은 별도 `usim_*` 테이블이 아니라 `voucher_products`의 `voucher_type='sim'` 계열로 흡수한다. |
| `front/admin/pages/members.html` / `front/admin/js/members.js` | 회원 | `users`, `user_profiles`, `user_auth_accounts`, `companion_links`, `user_blacklists` | 동일 유지 | 기본 회원 정보, 프로필, 연동 계정, 동행자, 차단 정보를 저장한다. |
| `front/admin/pages/members.html` / `front/admin/js/members.js` | 멤버십 | `membership_plans`, `membership_plan_benefits`, `user_memberships` | 동일 유지 | 멤버십 상품, 혜택, 사용자 가입 상태를 저장한다. |
| `front/admin/pages/members.html` / `front/admin/js/members.js` | 권한 | `roles`, `permissions`, `role_permissions`, `user_roles` | 동일 유지 | 역할, 권한, 역할-권한 연결, 사용자-역할 배정 정보를 저장한다. |
| `front/admin/pages/members.html` / `front/admin/js/members.js` | 문의 | `support_categories`, `support_tickets`, `support_comments`, `support_attachments` | 동일 유지 | 고객센터 분류, 문의, 댓글, 첨부파일을 저장한다. |
| `front/admin/pages/cms.html` / `front/admin/js/cms.js` | 공지 | `notices` | 동일 유지 | 서비스 공지사항을 저장한다. |
| `front/admin/pages/cms.html` / `front/admin/js/cms.js` | FAQ | `faqs`, `support_categories` | 동일 유지 | 자주 묻는 질문과 답변, 그리고 분류 체계를 저장한다. |
| `front/admin/pages/cms.html` / `front/admin/js/cms.js` | 배너 | `banner_slots`, `banners`, `cms_pages`, `cms_blocks`, `content_items`, `exposure_rules` | 동일 유지 | 배너 슬롯, 배너 본문, CMS 페이지/블록/콘텐츠 구조, 노출 규칙을 저장한다. |

## 2. bookings-common 유지 원칙

- `bookings`, `booking_items`, `booking_passengers`, `payment_transactions`, `payment_refunds`는 공통 예약 트리다.
- 이 테이블들은 항공만의 전용 구조가 아니라 숙박, 렌터카, 바우처까지 같이 받는 공통 골격으로 유지한다.
- `booking_passengers`를 `flight_passengers`로 바꾸지 않은 이유는 승객 데이터가 예약 트리의 일부이고, `travel_events`도 그 예약 트리에 붙기 때문이다.
- 항공 전용 이름으로 바꾸면 공통 예약 모델이 깨지고, bookings-common 원칙이 흔들린다.

## 3. 미확보 테이블 판단

| admin 기능 | 판단 | 비고 |
| --- | --- | --- |
| 대시보드 요약 | 별도 테이블 없음 | KPI와 최근 활동은 기존 예약/결제/회원/운영 로그를 집계해서 그린다. `dashboard_metric_snapshots` 같은 전용 테이블은 두지 않았다. |
| 권한 화면 전용 master | 별도 테이블 없음 | 권한은 `roles`, `permissions`, `role_permissions`, `user_roles`로 운영한다. 전용 `admin_role_scopes`는 없다. |
| 특가 전용 master | 별도 테이블 없음 | 특가는 `coupons`, `user_coupons`로 흡수했다. |
| 유심 전용 master | 별도 테이블 없음 | 유심은 `voucher_products`의 `voucher_type='sim'`으로 처리한다. |
| 항공 승객 전용 테이블 | 별도 테이블 없음 | `booking_passengers`를 유지한다. `flight_passengers`는 만들지 않았다. |

## 4. 이번 migration에서 추가된 핵심 테이블

- 예약/멤버십: `user_memberships`
- 숙소/상품: `properties`, `property_room_types`, `property_benefits`, `property_display_overrides`, `property_tags`, `voucher_products`, `voucher_product_benefits`, `inventory_stocks`, `inventory_adjustments`, `price_policies`
- 항공/렌터카: `flight_routes`, `flight_schedules`, `flight_fare_policies`, `flight_seat_inventories`, `rental_locations`, `rental_vehicle_classes`, `rental_vehicles`, `rental_rate_policies`, `rental_vehicle_inventories`
- CMS/배너: `banner_slots`, `banners`, `cms_pages`, `cms_blocks`, `content_items`, `exposure_rules`
- 운영/회원: `admin_action_logs`, `user_blacklists`, `admin_preferences`, `coupons`, `user_coupons`, `point_ledger`, `membership_plans`, `membership_plan_benefits`

## 5. 한줄 정리

- admin 화면은 전반적으로 기존 공통 예약 모델 위에 도메인별 마스터를 얹는 구조고, `booking_passengers`는 공통 예약 트리 안에서 유지하는 게 맞다.
