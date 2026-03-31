-- V18 booking / membership / voucher seed
-- repeat-safe and source-bound to front reservation, mypage, member, and deal data

INSERT INTO users (
    id,
    pw,
    name,
    phone,
    email,
    birth_date,
    gender,
    provider,
    role
)
VALUES
    ('hong_minji', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '홍민지', '010-1234-5678', 'minji.hong@jejugroup.example', '1990-01-01', 'F', 'PASS', 'USER')
ON DUPLICATE KEY UPDATE
    pw = VALUES(pw),
    name = VALUES(name),
    phone = VALUES(phone),
    email = VALUES(email),
    birth_date = VALUES(birth_date),
    gender = VALUES(gender),
    provider = VALUES(provider),
    role = VALUES(role);

INSERT INTO user_profiles (
    user_id,
    display_name,
    nickname,
    avatar_url,
    bio,
    preferred_language,
    marketing_opt_in
)
VALUES
    ('hong_minji', '홍민지', '민지', NULL, '제주 여행을 즐기는 멤버', 'ko-KR', 1)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    nickname = VALUES(nickname),
    avatar_url = VALUES(avatar_url),
    bio = VALUES(bio),
    preferred_language = VALUES(preferred_language),
    marketing_opt_in = VALUES(marketing_opt_in);

INSERT INTO bookings (
    booking_no,
    user_id,
    booking_type,
    status,
    payment_status,
    currency,
    total_amount,
    paid_amount,
    booked_at,
    cancelled_at,
    memo
)
VALUES
    ('BK-AIR-20261120-001', 'hong_minji', 'air', 'confirmed', 'paid', 'KRW', 324000.00, 324000.00, '2026-11-20 09:10:00.000', NULL, '모바일 탑승권, 위탁 수하물 15kg'),
    ('BK-STAY-20261015-001', 'hong_minji', 'stay', 'confirmed', 'paid', 'KRW', 480000.00, 480000.00, '2026-10-15 00:00:00.000', NULL, '조식 포함, 수영장, 얼리 체크인'),
    ('BK-RENT-20261015-001', 'hong_minji', 'rent', 'canceled', 'refunded', 'KRW', 135000.00, 0.00, '2026-10-15 09:30:00.000', '2026-10-15 10:00:00.000', '완전 자차, 공항 픽업, 전기차'),
    ('BK-VOUCH-20261015-001', 'hong_minji', 'voucher', 'confirmed', 'paid', 'KRW', 25000.00, 25000.00, '2026-10-15 00:00:00.000', NULL, '익일 수령, 인천공항 T1, 5GB 데이터'),
    ('BK-VOUCH-20261016-001', 'hong_minji', 'voucher', 'confirmed', 'paid', 'KRW', 89000.00, 89000.00, '2026-10-16 14:00:00.000', NULL, '장비 포함, 강사 동행, 수중 사진')
ON DUPLICATE KEY UPDATE
    booking_type = VALUES(booking_type),
    status = VALUES(status),
    payment_status = VALUES(payment_status),
    currency = VALUES(currency),
    total_amount = VALUES(total_amount),
    paid_amount = VALUES(paid_amount),
    booked_at = VALUES(booked_at),
    cancelled_at = VALUES(cancelled_at),
    memo = VALUES(memo);

INSERT INTO booking_items (
    booking_id,
    item_no,
    booking_type,
    item_name,
    product_code,
    supplier_name,
    service_start_date,
    service_end_date,
    quantity,
    unit_price,
    total_amount,
    currency
)
SELECT
    b.id,
    src.item_no,
    src.booking_type,
    src.item_name,
    src.product_code,
    src.supplier_name,
    src.service_start_date,
    src.service_end_date,
    src.quantity,
    src.unit_price,
    src.total_amount,
    src.currency
FROM (
    SELECT 'BK-AIR-20261120-001' AS booking_no, 1 AS item_no, 'air' AS booking_type, 'ICN → NRT 제주항공 7C1102' AS item_name, '7C1102' AS product_code, '제주항공' AS supplier_name, '2026-11-20' AS service_start_date, '2026-11-20' AS service_end_date, 1 AS quantity, 324000.00 AS unit_price, 324000.00 AS total_amount, 'KRW' AS currency
    UNION ALL SELECT 'BK-STAY-20261015-001', 1, 'stay', 'Jeju Ocean Suite Hotel', 'stay-jeju-ocean-suite', '제주스테이', '2026-10-15', '2026-10-17', 1, 480000.00, 480000.00, 'KRW'
    UNION ALL SELECT 'BK-RENT-20261015-001', 1, 'rent', 'IONIQ 6 Long Range (제주렌터카)', 'rent-ioniq6-long-range', '제주렌터카', '2026-10-15', '2026-10-17', 1, 135000.00, 135000.00, 'KRW'
    UNION ALL SELECT 'BK-VOUCH-20261015-001', 1, 'voucher', '일본 4G 유심 (매일 1GB/5일)', 'japan-sim-5d', 'JAPAN SIM', '2026-10-15', '2026-10-20', 1, 25000.00, 25000.00, 'KRW'
    UNION ALL SELECT 'BK-VOUCH-20261016-001', 1, 'voucher', '서귀포 문섬 스쿠버다이빙 체험', 'scuba-munseom', '제주 액티비티', '2026-10-16', '2026-10-16', 1, 89000.00, 89000.00, 'KRW'
) AS src
JOIN bookings b ON b.booking_no = src.booking_no
ON DUPLICATE KEY UPDATE
    booking_type = VALUES(booking_type),
    item_name = VALUES(item_name),
    product_code = VALUES(product_code),
    supplier_name = VALUES(supplier_name),
    service_start_date = VALUES(service_start_date),
    service_end_date = VALUES(service_end_date),
    quantity = VALUES(quantity),
    unit_price = VALUES(unit_price),
    total_amount = VALUES(total_amount),
    currency = VALUES(currency);

INSERT INTO coupons (
    coupon_code,
    coupon_name,
    coupon_type,
    discount_value,
    minimum_order_amount,
    maximum_discount_amount,
    valid_from,
    valid_to,
    issue_limit,
    is_active,
    description
)
VALUES
    ('JAPANGO30', '일본 여행 전용', 'amount', 30000.00, 0.00, 30000.00, '2026-03-01', NULL, NULL, 1, '도쿄/오사카/후쿠오카 호텔 할인'),
    ('GLOBAL8', '전 세계 호텔 쿠폰', 'percent', 8.00, 0.00, 100000.00, '2026-03-01', NULL, NULL, 1, '최대 10만원 할인 (등급 무관)'),
    ('DONKI5000', '돈키호테 할인', 'amount', 5000.00, 0.00, 5000.00, '2026-03-01', NULL, NULL, 1, '일본 전 지점 사용 가능 (면세 중복)'),
    ('SAFE_TRIP', '해외 여행자 보험', 'free', 0.00, 0.00, 0.00, '2026-03-01', NULL, NULL, 1, '제주항공 항공권 구매 고객 대상')
ON DUPLICATE KEY UPDATE
    coupon_name = VALUES(coupon_name),
    coupon_type = VALUES(coupon_type),
    discount_value = VALUES(discount_value),
    minimum_order_amount = VALUES(minimum_order_amount),
    maximum_discount_amount = VALUES(maximum_discount_amount),
    valid_from = VALUES(valid_from),
    valid_to = VALUES(valid_to),
    issue_limit = VALUES(issue_limit),
    is_active = VALUES(is_active),
    description = VALUES(description);

INSERT INTO voucher_products (
    voucher_code,
    property_id,
    product_name,
    voucher_type,
    face_value,
    sale_price,
    valid_days,
    is_active
)
VALUES
    ('vouch-japan-sim-5d', NULL, '일본 4G 유심', 'sim', 25000.00, 25000.00, 5, 1),
    ('vouch-scuba-munseom', NULL, '서귀포 문섬 스쿠버다이빙 체험', 'activity', 89000.00, 89000.00, 1, 1)
ON DUPLICATE KEY UPDATE
    property_id = VALUES(property_id),
    product_name = VALUES(product_name),
    voucher_type = VALUES(voucher_type),
    face_value = VALUES(face_value),
    sale_price = VALUES(sale_price),
    valid_days = VALUES(valid_days),
    is_active = VALUES(is_active);

INSERT INTO voucher_product_benefits (
    voucher_product_id,
    benefit_code,
    benefit_name,
    sort_order,
    is_active
)
SELECT
    vp.id,
    src.benefit_code,
    src.benefit_name,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'vouch-japan-sim-5d' AS voucher_code, 'next-day-delivery' AS benefit_code, '익일 수령' AS benefit_name, 1 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'vouch-japan-sim-5d', 'icn-terminal1', '인천공항 T1', 2, 1
    UNION ALL SELECT 'vouch-japan-sim-5d', 'daily-5gb', '5GB 데이터', 3, 1
    UNION ALL SELECT 'vouch-scuba-munseom', 'equipment-included', '장비 포함', 1, 1
    UNION ALL SELECT 'vouch-scuba-munseom', 'guide-included', '강사 동행', 2, 1
    UNION ALL SELECT 'vouch-scuba-munseom', 'underwater-photo', '수중 사진', 3, 1
) AS src
JOIN voucher_products vp ON vp.voucher_code = src.voucher_code
ON DUPLICATE KEY UPDATE
    benefit_name = VALUES(benefit_name),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);
