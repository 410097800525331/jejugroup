-- landing membership seed from front/index.html
-- source-complete textual seed only; no missing commercial values are invented

INSERT INTO membership_plans (
    plan_code,
    plan_name,
    tier_level,
    monthly_fee,
    is_active
)
VALUES
    ('landing-silver', '실버 멤버', 1, 29900.00, 1),
    ('landing-gold', '골드 멤버', 2, 49900.00, 1),
    ('landing-platinum', '플래티넘 멤버', 3, 79900.00, 1)
ON DUPLICATE KEY UPDATE
    plan_name = VALUES(plan_name),
    tier_level = VALUES(tier_level),
    monthly_fee = VALUES(monthly_fee),
    is_active = VALUES(is_active);

INSERT INTO membership_plan_benefits (
    membership_plan_id,
    benefit_code,
    benefit_name,
    benefit_type,
    benefit_value,
    benefit_description,
    sort_order,
    is_active
)
SELECT
    mp.id,
    src.benefit_code,
    src.benefit_name,
    'text',
    NULL,
    src.benefit_name,
    src.sort_order,
    1
FROM (
    SELECT 'landing-silver' AS plan_code, 'air-discount-5' AS benefit_code, '항공권 5% 할인' AS benefit_name, 1 AS sort_order
    UNION ALL SELECT 'landing-silver', 'stay-discount-10', '호텔 예약 10% 할인', 2
    UNION ALL SELECT 'landing-silver', 'rent-base-discount', '렌트카 기본료 할인', 3
    UNION ALL SELECT 'landing-silver', 'priority-support', '우선 고객 지원', 4
    UNION ALL SELECT 'landing-gold', 'air-discount-10', '항공권 10% 할인', 1
    UNION ALL SELECT 'landing-gold', 'stay-discount-15', '호텔 예약 15% 할인', 2
    UNION ALL SELECT 'landing-gold', 'rent-base-discount-20', '렌트카 기본료 20% 할인', 3
    UNION ALL SELECT 'landing-gold', 'free-airport-lounge', '무료 공항 라운지', 4
    UNION ALL SELECT 'landing-gold', 'priority-booking', '우선 예약 서비스', 5
    UNION ALL SELECT 'landing-platinum', 'air-discount-15', '항공권 15% 할인', 1
    UNION ALL SELECT 'landing-platinum', 'stay-discount-20', '호텔 예약 20% 할인', 2
    UNION ALL SELECT 'landing-platinum', 'rent-base-discount-30', '렌트카 기본료 30% 할인', 3
    UNION ALL SELECT 'landing-platinum', 'vip-lounge', 'VIP 라운지 이용', 4
    UNION ALL SELECT 'landing-platinum', 'dedicated-concierge', '전담 컨시어지 서비스', 5
    UNION ALL SELECT 'landing-platinum', 'free-cancel-policy', '무료 취소 정책', 6
) AS src
JOIN membership_plans mp ON mp.plan_code = src.plan_code
ON DUPLICATE KEY UPDATE
    benefit_name = VALUES(benefit_name),
    benefit_type = VALUES(benefit_type),
    benefit_value = VALUES(benefit_value),
    benefit_description = VALUES(benefit_description),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);
