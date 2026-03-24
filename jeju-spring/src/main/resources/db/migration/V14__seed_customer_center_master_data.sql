-- customer-center master seed from front/apps/cs/client/src/data
-- existing schema untouched; repeat-safe inserts only

INSERT INTO support_categories (
    service_type,
    code,
    name,
    description,
    sort_order,
    is_active
)
VALUES
    ('common', 'general', '일반/내용', NULL, 1, 1),
    ('common', 'cancel-refund', '취소/환불', NULL, 2, 1),
    ('common', 'account', '회원/로그인', NULL, 3, 1),
    ('common', 'partnership', '제휴/사업 제안', NULL, 4, 1),
    ('common', 'other', '기타', NULL, 5, 1),
    ('jeju-air', 'reservation', '예약', NULL, 1, 1),
    ('jeju-air', 'cancel', '취소', NULL, 2, 1),
    ('jeju-air', 'refund', '환불', NULL, 3, 1),
    ('jeju-air', 'baggage', '수하물', NULL, 4, 1),
    ('jeju-air', 'checkin', '체크인/탑승', NULL, 5, 1),
    ('jeju-air', 'point', '리프레시 포인트', NULL, 6, 1),
    ('jeju-air', 'other', '기타', NULL, 7, 1),
    ('jeju-stay', 'booking', '예약', NULL, 1, 1),
    ('jeju-stay', 'cancel', '취소', NULL, 2, 1),
    ('jeju-stay', 'refund', '환불', NULL, 3, 1),
    ('jeju-stay', 'checkin', '체크인/이용', NULL, 4, 1),
    ('jeju-stay', 'facility', '객실/부대시설', NULL, 5, 1),
    ('jeju-stay', 'other', '기타', NULL, 6, 1),
    ('jeju-rental', 'car-booking', '예약', NULL, 1, 1),
    ('jeju-rental', 'cancel', '취소', NULL, 2, 1),
    ('jeju-rental', 'refund', '환불', NULL, 3, 1),
    ('jeju-rental', 'insurance', '보험/면책', NULL, 4, 1),
    ('jeju-rental', 'pickup', '인수/반납', NULL, 5, 1),
    ('jeju-rental', 'other', '기타', NULL, 6, 1)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO notices (
    service_type,
    title,
    excerpt,
    content,
    is_pinned,
    is_active,
    published_at
)
SELECT
    src.service_type,
    src.title,
    src.excerpt,
    src.content,
    src.is_pinned,
    src.is_active,
    src.published_at
FROM (
    SELECT
        'jeju-air' AS service_type,
        '2026년 2월 제주항공 신규 노선 운항 안내' AS title,
        '서울 인천공항에서 방콕, 홍콩, 타이페이로 운항하는 신규 노선이 시작됩니다.' AS excerpt,
        '제주항공에서 새로운 국제선 노선을 개설합니다. 서울 인천공항에서 방콕, 홍콩, 타이페이로 운항하는 신규 노선이 2026년 3월부터 시작됩니다.' AS content,
        0 AS is_pinned,
        1 AS is_active,
        '2026-02-27 00:00:00.000' AS published_at
    UNION ALL
    SELECT
        'jeju-stay',
        '제주스테이 봄 시즌 특가 이벤트 시작',
        '최대 40% 할인된 가격으로 제주의 아름다운 숙소를 예약하세요.',
        '제주스테이에서 봄 시즌 특가 이벤트를 진행합니다. 2026년 3월 1일부터 5월 31일까지 최대 40% 할인된 가격으로 예약하실 수 있습니다.',
        0,
        1,
        '2026-02-25 00:00:00.000'
    UNION ALL
    SELECT
        'jeju-rental',
        '제주렌터카 예약 시스템 업그레이드 완료',
        '더욱 편리해진 예약 시스템으로 차량 예약이 더 쉬워졌습니다.',
        '더욱 편리해진 예약 시스템으로 차량 예약이 더 쉬워졌습니다. 새로운 시스템에서는 실시간 차량 가용성 확인, 빠른 결제, 자동 확인 문자 발송 등의 기능이 추가되었습니다.',
        0,
        1,
        '2026-02-23 00:00:00.000'
    UNION ALL
    SELECT
        'jeju-air',
        '제주항공 마일리지 프로그램 개편 안내',
        '더욱 혜택이 많아진 마일리지 프로그램이 시작됩니다.',
        '더욱 혜택이 많아진 마일리지 프로그램이 시작됩니다. 기존 회원님들은 자동으로 새로운 프로그램에 등록되며, 더 많은 마일리지를 적립하고 사용할 수 있게 됩니다.',
        0,
        1,
        '2026-02-20 00:00:00.000'
    UNION ALL
    SELECT
        'jeju-stay',
        '제주스테이 새로운 숙소 추가 오픈',
        '제주스테이에 새로운 프리미엄 숙소들이 추가되었습니다.',
        '제주스테이에 새로운 프리미엄 숙소들이 추가되었습니다. 제주의 아름다운 자연을 감상할 수 있는 오션뷰 펜션, 전통 한옥 게스트하우스 등 다양한 숙소를 선택하실 수 있습니다.',
        0,
        1,
        '2026-02-18 00:00:00.000'
    UNION ALL
    SELECT
        'jeju-rental',
        '제주렌터카 전기차 추가 도입',
        '제주렌터카에서 환경 친화적인 전기차를 추가로 도입했습니다.',
        '제주렌터카에서 환경 친화적인 전기차를 추가로 도입했습니다. 테슬라, 현대 아이오닉 등 최신 전기차를 저렴한 가격에 렌탈하실 수 있습니다.',
        0,
        1,
        '2026-02-15 00:00:00.000'
) AS src
WHERE NOT EXISTS (
    SELECT 1
    FROM notices n
    WHERE n.service_type = src.service_type
      AND n.title = src.title
);

INSERT INTO faqs (
    service_type,
    category,
    question,
    answer,
    sort_order,
    is_active
)
SELECT
    src.service_type,
    src.category,
    src.question,
    src.answer,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'jeju-air' AS service_type, '예약 및 변경' AS category, '제주항공 항공권 예약 후 취소는 어떻게 하나요?' AS question, '제주항공 웹사이트 또는 모바일 앱에서 ''예약 조회''를 통해 예약 번호와 이메일을 입력하여 취소할 수 있습니다.' AS answer, 1 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'jeju-air', '수하물', '제주항공 수하물 규정은 어떻게 되나요?', '기본 수하물 1개(10kg)가 포함되며, 추가 수하물은 유료입니다. 자세한 내용은 고객센터에 문의하세요.', 2, 1
    UNION ALL SELECT 'jeju-air', '마일리지', '제주항공 마일리지는 어떻게 적립하나요?', '항공권 구매 시 자동으로 마일리지가 적립됩니다. 적립률은 항공권 종류에 따라 다릅니다.', 3, 1
    UNION ALL SELECT 'jeju-air', '좌석', '제주항공 좌석 선택은 언제 가능한가요?', '예약 완료 후 24시간 이내에 좌석을 선택할 수 있습니다. 추가 요금이 발생할 수 있습니다.', 4, 1
    UNION ALL SELECT 'jeju-air', '탑승', '제주항공 탑승 수속은 언제부터 가능한가요?', '출발 시간 2시간 전부터 탑승 수속을 시작하며, 30분 전에 마감됩니다.', 5, 1
    UNION ALL SELECT 'jeju-air', '특수 탑승', '제주항공 유아 탑승 정책은 어떻게 되나요?', '생후 14일 이상의 유아부터 탑승 가능하며, 성인 1명당 유아 1명만 동반할 수 있습니다.', 6, 1
    UNION ALL SELECT 'jeju-air', '특수 탑승', '제주항공 반려동물 탑승은 가능한가요?', '반려동물은 특별한 허가 절차를 거쳐야 하며, 사전에 고객센터에 문의해야 합니다.', 7, 1
    UNION ALL SELECT 'jeju-air', '특수 서비스', '제주항공 휠체어 탑승 서비스는 어떻게 되나요?', '휠체어 탑승 서비스를 제공하며, 사전 예약이 필요합니다. 고객센터에 문의하세요.', 8, 1
    UNION ALL SELECT 'jeju-air', '기내 서비스', '제주항공 기내식은 제공되나요?', '국제선의 경우 기내식이 제공되며, 국내선은 음료 및 간식만 제공됩니다.', 9, 1
    UNION ALL SELECT 'jeju-air', '예약 및 변경', '제주항공 좌석 변경은 가능한가요?', '탑승 전까지 좌석 변경이 가능하며, 추가 요금이 발생할 수 있습니다.', 10, 1
    UNION ALL SELECT 'jeju-air', '환불 및 보상', '제주항공 환불 정책은 어떻게 되나요?', '항공권 종류에 따라 환불 정책이 다릅니다. 상세 내용은 구매 시 확인하세요.', 11, 1
    UNION ALL SELECT 'jeju-air', '예약 및 변경', '제주항공 예약 변경은 가능한가요?', '출발 24시간 전까지 예약 변경이 가능하며, 추가 요금이 발생할 수 있습니다.', 12, 1
    UNION ALL SELECT 'jeju-air', '탑승권', '제주항공 탑승권은 어떻게 받나요?', '웹 체크인 또는 공항 체크인을 통해 탑승권을 받을 수 있습니다.', 13, 1
    UNION ALL SELECT 'jeju-air', '체크인', '제주항공 웹 체크인은 언제부터 가능한가요?', '출발 24시간 전부터 웹 체크인이 가능합니다.', 14, 1
    UNION ALL SELECT 'jeju-air', '특수 서비스', '제주항공 특별 서비스 요청은 어떻게 하나요?', '예약 시 또는 고객센터를 통해 특별 서비스를 요청할 수 있습니다.', 15, 1
    UNION ALL SELECT 'jeju-air', '마일리지', '제주항공 마일리지 사용은 어떻게 하나요?', '웹사이트 또는 모바일 앱에서 마일리지로 항공권을 구매할 수 있습니다.', 16, 1
    UNION ALL SELECT 'jeju-air', '마일리지', '제주항공 마일리지 유효기간은 얼마나 되나요?', '마일리지는 마지막 사용일로부터 3년간 유효합니다.', 17, 1
    UNION ALL SELECT 'jeju-air', '수하물', '제주항공 수하물 추가 구매는 가능한가요?', '예약 시 또는 탑승 전에 추가 수하물을 구매할 수 있습니다.', 18, 1
    UNION ALL SELECT 'jeju-air', '수하물', '제주항공 초과 수하물 요금은 얼마나 되나요?', '초과 수하물 요금은 무게와 크기에 따라 다르니 고객센터에 문의하세요.', 19, 1
    UNION ALL SELECT 'jeju-air', '규정', '제주항공 위험물 탑승 규정은 어떻게 되나요?', '위험물은 탑승이 금지되며, 자세한 내용은 고객센터에 문의하세요.', 20, 1
    UNION ALL SELECT 'jeju-air', '선물', '제주항공 항공권 선물은 가능한가요?', '항공권 선물이 가능하며, 웹사이트에서 선물 옵션을 선택할 수 있습니다.', 21, 1
    UNION ALL SELECT 'jeju-air', '단체 예약', '제주항공 단체 예약은 어떻게 하나요?', '10명 이상의 단체 예약은 고객센터에 문의하여 진행할 수 있습니다.', 22, 1
    UNION ALL SELECT 'jeju-air', '분실', '제주항공 항공권 분실 시 어떻게 하나요?', '분실한 항공권은 고객센터에 문의하여 재발급받을 수 있습니다.', 23, 1
    UNION ALL SELECT 'jeju-air', '환불 및 보상', '제주항공 지연 또는 취소 시 보상은 어떻게 되나요?', '항공편 지연이나 취소 시 규정에 따라 보상이 제공됩니다.', 24, 1
    UNION ALL SELECT 'jeju-air', '고객센터', '제주항공 고객센터 운영 시간은 어떻게 되나요?', '제주항공 고객센터는 24시간 운영되며, 전화 1661-1114로 문의 가능합니다.', 25, 1
    UNION ALL SELECT 'jeju-stay', '환불 정책', '제주스테이 숙소 예약 후 환불 정책은?', '각 숙소마다 다른 환불 정책이 있으니 예약 시 확인해주세요.', 1, 1
    UNION ALL SELECT 'jeju-stay', '예약 변경', '제주스테이 예약 변경은 가능한가요?', '체크인 7일 전까지 예약 변경이 가능합니다. 추가 요금이 발생할 수 있습니다.', 2, 1
    UNION ALL SELECT 'jeju-stay', '체크인', '제주스테이 체크인 시간은 몇 시인가요?', '일반적으로 오후 3시부터 체크인이 가능하며, 숙소마다 다를 수 있습니다.', 3, 1
    UNION ALL SELECT 'jeju-stay', '체크아웃', '제주스테이 체크아웃 시간은 몇 시인가요?', '일반적으로 오전 11시까지 체크아웃해야 하며, 숙소마다 다를 수 있습니다.', 4, 1
    UNION ALL SELECT 'jeju-stay', '체크인', '제주스테이 조기 체크인은 가능한가요?', '조기 체크인은 숙소 상황에 따라 가능할 수 있으니 사전에 문의하세요.', 5, 1
    UNION ALL SELECT 'jeju-stay', '체크아웃', '제주스테이 늦은 체크아웃은 가능한가요?', '늦은 체크아웃은 추가 요금이 발생하며, 사전에 문의해야 합니다.', 6, 1
    UNION ALL SELECT 'jeju-stay', '반려동물', '제주스테이 반려동물 동반은 가능한가요?', '반려동물 동반 가능 여부는 숙소마다 다르니 예약 시 확인하세요.', 7, 1
    UNION ALL SELECT 'jeju-stay', '유아', '제주스테이 유아 동반은 가능한가요?', '대부분의 숙소에서 유아 동반이 가능하며, 유아용 침구는 사전에 요청하세요.', 8, 1
    UNION ALL SELECT 'jeju-stay', '요금', '제주스테이 아이 동반 시 추가 요금이 있나요?', '아이 동반 시 추가 요금 정책은 숙소마다 다릅니다.', 9, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 와이파이는 제공되나요?', '대부분의 숙소에서 무료 와이파이를 제공합니다.', 10, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 에어컨은 있나요?', '대부분의 숙소에서 에어컨을 제공하며, 숙소마다 다를 수 있습니다.', 11, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 난방은 어떻게 되나요?', '대부분의 숙소에서 난방을 제공하며, 계절에 따라 다릅니다.', 12, 1
    UNION ALL SELECT 'jeju-stay', '조식', '제주스테이 조식은 제공되나요?', '조식 제공 여부는 숙소마다 다르니 예약 시 확인하세요.', 13, 1
    UNION ALL SELECT 'jeju-stay', '주차', '제주스테이 주차장은 있나요?', '대부분의 숙소에서 주차장을 제공하며, 유료일 수 있습니다.', 14, 1
    UNION ALL SELECT 'jeju-stay', '서비스', '제주스테이 짐 보관은 가능한가요?', '대부분의 숙소에서 짐 보관 서비스를 제공합니다.', 15, 1
    UNION ALL SELECT 'jeju-stay', '서비스', '제주스테이 세탁 서비스는 있나요?', '세탁 서비스 제공 여부는 숙소마다 다릅니다.', 16, 1
    UNION ALL SELECT 'jeju-stay', '청소', '제주스테이 객실 청소는 매일 되나요?', '객실 청소 주기는 숙소마다 다르니 사전에 확인하세요.', 17, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 욕실은 어떻게 되나요?', '대부분의 숙소에서 개인 욕실을 제공합니다.', 18, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 TV는 있나요?', '대부분의 숙소에서 TV를 제공합니다.', 19, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 냉장고는 있나요?', '대부분의 숙소에서 냉장고를 제공합니다.', 20, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 에스프레소 머신은 있나요?', '일부 숙소에서 에스프레소 머신을 제공합니다.', 21, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 미니바는 있나요?', '일부 숙소에서 미니바를 제공합니다.', 22, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 헤어드라이기는 있나요?', '대부분의 숙소에서 헤어드라이기를 제공합니다.', 23, 1
    UNION ALL SELECT 'jeju-stay', '편의시설', '제주스테이 객실 내 욕가운은 있나요?', '일부 숙소에서 욕가운을 제공합니다.', 24, 1
    UNION ALL SELECT 'jeju-stay', '고객센터', '제주스테이 고객센터 운영 시간은 어떻게 되나요?', '제주스테이 고객센터는 09:00 ~ 22:00에 운영되며, 전화 1661-2222로 문의 가능합니다.', 25, 1
    UNION ALL SELECT 'jeju-rental', '렌탈 기간', '제주렌터카 최소 렌탈 기간은 얼마나 되나요?', '최소 렌탈 기간은 1일이며, 3일 이상 렌탈 시 추가 할인이 적용됩니다.', 1, 1
    UNION ALL SELECT 'jeju-rental', '예약 취소', '제주렌터카 예약 취소는 어떻게 하나요?', '렌탈 날짜 7일 전까지 취소 가능하며, 이후 취소 수수료가 발생합니다.', 2, 1
    UNION ALL SELECT 'jeju-rental', '예약 변경', '제주렌터카 예약 변경은 가능한가요?', '렌탈 날짜 7일 전까지 예약 변경이 가능합니다.', 3, 1
    UNION ALL SELECT 'jeju-rental', '보험', '제주렌터카 보험은 필수인가요?', '기본 보험(자차 보험)이 포함되어 있으며, 추가 보험은 선택사항입니다.', 4, 1
    UNION ALL SELECT 'jeju-rental', '운전자', '제주렌터카 운전자 나이 제한이 있나요?', '만 21세 이상이어야 렌탈 가능하며, 국제 운전면허증이 필요합니다.', 5, 1
    UNION ALL SELECT 'jeju-rental', '운전면허', '제주렌터카 운전면허증은 어떤 것이 필요한가요?', '한국 운전면허증 또는 국제 운전면허증이 필요합니다.', 6, 1
    UNION ALL SELECT 'jeju-rental', '결제', '제주렌터카 신용카드는 필수인가요?', '신용카드가 필수이며, 보증금 결제에 사용됩니다.', 7, 1
    UNION ALL SELECT 'jeju-rental', '픽업', '제주렌터카 픽업 시간은 언제인가요?', '일반적으로 오전 8시부터 오후 8시까지 픽업이 가능합니다.', 8, 1
    UNION ALL SELECT 'jeju-rental', '반납', '제주렌터카 반납 시간은 언제인가요?', '일반적으로 오전 8시부터 오후 8시까지 반납이 가능합니다.', 9, 1
    UNION ALL SELECT 'jeju-rental', '반납', '제주렌터카 늦은 반납 시 추가 요금이 있나요?', '늦은 반납 시 시간당 추가 요금이 발생합니다.', 10, 1
    UNION ALL SELECT 'jeju-rental', '픽업', '제주렌터카 공항 픽업 서비스는 있나요?', '공항 픽업 서비스가 있으며, 추가 요금이 발생할 수 있습니다.', 11, 1
    UNION ALL SELECT 'jeju-rental', '픽업', '제주렌터카 호텔 픽업 서비스는 있나요?', '호텔 픽업 서비스가 있으며, 추가 요금이 발생할 수 있습니다.', 12, 1
    UNION ALL SELECT 'jeju-rental', '차량', '제주렌터카 차량 종류는 어떻게 되나요?', '경차, 준중형, 중형, SUV 등 다양한 차종을 제공합니다.', 13, 1
    UNION ALL SELECT 'jeju-rental', '변속기', '제주렌터카 자동 변속기 차량은 있나요?', '자동 변속기 차량이 있으며, 추가 요금이 발생할 수 있습니다.', 14, 1
    UNION ALL SELECT 'jeju-rental', '변속기', '제주렌터카 수동 변속기 차량은 있나요?', '수동 변속기 차량도 제공되며, 차량 선택 시 확인하세요.', 15, 1
    UNION ALL SELECT 'jeju-rental', '차량', '제주렌터카 전기차는 있나요?', '환경 친화적인 전기차를 제공하며, 추가 요금이 발생할 수 있습니다.', 16, 1
    UNION ALL SELECT 'jeju-rental', '편의시설', '제주렌터카 차량 내 네비게이션은 있나요?', '대부분의 차량에 네비게이션이 장착되어 있습니다.', 17, 1
    UNION ALL SELECT 'jeju-rental', '편의시설', '제주렌터카 차량 내 블랙박스는 있나요?', '대부분의 차량에 블랙박스가 장착되어 있습니다.', 18, 1
    UNION ALL SELECT 'jeju-rental', '편의시설', '제주렌터카 차량 내 휴대폰 충전기는 있나요?', '일부 차량에 휴대폰 충전기가 장착되어 있습니다.', 19, 1
    UNION ALL SELECT 'jeju-rental', '편의시설', '제주렌터카 차량 내 와이파이는 있나요?', '일부 차량에 와이파이가 장착되어 있습니다.', 20, 1
    UNION ALL SELECT 'jeju-rental', '손상', '제주렌터카 차량 손상 시 어떻게 하나요?', '차량 손상 시 보험에 따라 처리되며, 고객센터에 즉시 문의하세요.', 21, 1
    UNION ALL SELECT 'jeju-rental', '위반', '제주렌터카 교통 위반 시 어떻게 하나요?', '교통 위반 시 운전자가 책임지며, 고객센터에 문의하세요.', 22, 1
    UNION ALL SELECT 'jeju-rental', '사고', '제주렌터카 사고 시 어떻게 하나요?', '사고 발생 시 즉시 고객센터에 문의하고 경찰에 신고하세요.', 23, 1
    UNION ALL SELECT 'jeju-rental', '고객센터', '제주렌터카 고객센터 운영 시간은 어떻게 되나요?', '제주렌터카 고객센터는 08:00 ~ 20:00에 운영되며, 전화 1661-3333으로 문의 가능합니다.', 24, 1
    UNION ALL SELECT 'jeju-rental', '연락처', '제주렌터카 연락처는 어디인가요?', '제주렌터카 고객센터 전화번호는 1661-3333입니다.', 25, 1
) AS src
WHERE NOT EXISTS (
    SELECT 1
    FROM faqs f
    WHERE f.service_type = src.service_type
      AND f.question = src.question
);
