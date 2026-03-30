-- V27 restore managed banner public-facing copy

UPDATE banner_slots s
JOIN (
    SELECT 'stay_hotel_promo_main' AS slot_code, '제주항공 탑승객 인증 시 전 세계 호텔 7% 추가 할인' AS slot_name
    UNION ALL SELECT 'stay_hotel_promo_sub_1', '리프레시 포인트로 호텔 결제 가능'
    UNION ALL SELECT 'stay_hotel_promo_sub_2', '숙소 + 렌터카 패키지 최대 15% 할인'
    UNION ALL SELECT 'stay_private_promo_main', '프라이빗 스테이 예약 시 얼리 체크인 & 웰컴 키트 제공'
    UNION ALL SELECT 'stay_private_promo_sub_1', '인생샷 포인트 스냅 촬영 할인'
    UNION ALL SELECT 'stay_private_promo_sub_2', '인룸 다이닝 와인 & 플래터'
    UNION ALL SELECT 'stay_life_synergy_banner', '전 세계 어디든 제주항공 X 모빌리티 혜택'
    UNION ALL SELECT 'stay_life_promo_1', '위탁 수하물 10kg 추가 증정'
    UNION ALL SELECT 'stay_life_promo_2', '로컬 라이프 멤버십 카드'
    UNION ALL SELECT 'stay_life_promo_3', '한 달 살기 가이드북 제공'
    UNION ALL SELECT 'stay_activities_auth_banner', '제주항공 탑승객 인증'
) src ON src.slot_code = s.slot_code
SET s.slot_name = src.slot_name
WHERE s.slot_code IN (
    'stay_hotel_promo_main',
    'stay_hotel_promo_sub_1',
    'stay_hotel_promo_sub_2',
    'stay_private_promo_main',
    'stay_private_promo_sub_1',
    'stay_private_promo_sub_2',
    'stay_life_synergy_banner',
    'stay_life_promo_1',
    'stay_life_promo_2',
    'stay_life_promo_3',
    'stay_activities_auth_banner'
);

UPDATE banners b
JOIN (
    SELECT
        'stay_hotel_promo_main' AS banner_code,
        'JEJU UNIVERSE' AS eyebrow,
        '제주항공 탑승객 인증 시 전 세계 호텔 7% 추가 할인' AS title,
        '제주항공 예약 확인서를 업로드하고 특별 할인을 받으세요' AS body,
        '자세히 보기' AS cta_label
    UNION ALL SELECT 'stay_hotel_promo_sub_1', 'REFRESH POINT', '리프레시 포인트로 호텔 결제 가능', '', '포인트 사용하기'
    UNION ALL SELECT 'stay_hotel_promo_sub_2', 'PACKAGE DEAL', '숙소 + 렌터카 패키지 최대 15% 할인', '', '패키지 보기'
    UNION ALL SELECT 'stay_private_promo_main', 'PREMIUM CHECK-IN', '프라이빗 스테이 예약 시 얼리 체크인 & 웰컴 키트 제공', '제주 유니버스 회원을 위한 특별한 시작', '혜택 확인하기'
    UNION ALL SELECT 'stay_private_promo_sub_1', 'SNAP PHOTO', '인생샷 포인트 스냅 촬영 할인', '', '작가 보기'
    UNION ALL SELECT 'stay_private_promo_sub_2', 'DINING', '인룸 다이닝 와인 & 플래터', '', '메뉴 보기'
    UNION ALL SELECT 'stay_life_synergy_banner', '', '전 세계 어디든 제주항공 X 모빌리티 혜택', '항공권 결합 시 리프레시 포인트 2배 적립 + 해외 렌터카 50% 할인!', '제주 유니버스 혜택 보기'
    UNION ALL SELECT 'stay_life_promo_1', '', '위탁 수하물 10kg 추가 증정', '짐이 많은 장기 여행도 걱정 없이, 제주항공 이용 시 혜택 제공', ''
    UNION ALL SELECT 'stay_life_promo_2', '', '로컬 라이프 멤버십 카드', '현지인 맛집, 카페, 렌터카까지 최대 20% 제휴 할인', ''
    UNION ALL SELECT 'stay_life_promo_3', '', '한 달 살기 가이드북 제공', '쓰레기 배출일부터 근처 인프라 정보까지 생활 필수 정보 수록', ''
    UNION ALL SELECT 'stay_activities_auth_banner', '', '제주항공 탑승객 인증', '항공권번호를 인증하고 최대 50% 추가 할인 혜택을 받으세요.', '인증하고 혜택받기'
) src ON src.banner_code = b.banner_code
SET
    b.title = src.title,
    b.subtitle = COALESCE(NULLIF(src.body, ''), NULLIF(src.eyebrow, ''), NULLIF(src.cta_label, ''), src.banner_code),
    b.eyebrow = src.eyebrow,
    b.body = src.body,
    b.cta_label = src.cta_label
WHERE b.banner_code IN (
    'stay_hotel_promo_main',
    'stay_hotel_promo_sub_1',
    'stay_hotel_promo_sub_2',
    'stay_private_promo_main',
    'stay_private_promo_sub_1',
    'stay_private_promo_sub_2',
    'stay_life_synergy_banner',
    'stay_life_promo_1',
    'stay_life_promo_2',
    'stay_life_promo_3',
    'stay_activities_auth_banner'
);
