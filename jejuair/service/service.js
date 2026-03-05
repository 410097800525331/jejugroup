'use strict';

const ITEMS_PER_PAGE = 10;

/* =====================================================
   데이터 (백엔드 연동 시 API 응답으로 교체)
   ===================================================== */
const HC_DATA = {
  air: {
    brand: '제주항공',
    notices: [
      {
        id: 15, category: '이벤트',
        title: 'SNS 후기 작성 시 마일리지 추가 적립 이벤트',
        date: '2026-02-28', views: 1842,
        content: `제주항공 공식 SNS(인스타그램, 블로그)에 탑승 후기를 작성하시면 마일리지를 추가 적립해 드립니다.\n\n■ 이벤트 기간: 2026년 3월 1일 ~ 2026년 3월 31일\n■ 대상: 제주항공 회원 전체\n■ 적립 조건: 공식 해시태그(#제주항공 #JejuAir) 포함 후기 작성 후 고객센터 제출\n■ 적립 마일리지: 인스타그램 500마일 / 블로그 1,000마일\n■ 적립 시기: 확인 후 영업일 기준 7일 이내\n\n※ 1인 1회 참여 가능하며, 허위 후기 작성 시 적립이 취소될 수 있습니다.`
      },
      {
        id: 14, category: '중요',
        title: '신분증 미소지 승객 탑승 불가 안내',
        date: '2026-02-25', views: 3210,
        content: `항공보안법에 따라 신분증을 소지하지 않은 승객은 탑승이 불가합니다.\n\n■ 인정 신분증: 주민등록증, 운전면허증, 여권, 외국인등록증 등 정부 발행 사진 신분증\n■ 대안: 공항 내 무인민원발급기에서 발급한 임시 신분증명서 사용 가능\n\n출발 전 반드시 신분증 지참 여부를 확인하시기 바랍니다.`
      },
      {
        id: 13, category: '안내',
        title: '고객센터 전화상담 운영시간 변경 안내',
        date: '2026-02-20', views: 2105,
        content: `2026년 3월 1일부터 고객센터 전화상담 운영시간이 변경됩니다.\n\n■ 변경 전: 09:00 ~ 18:00 (주말·공휴일 제외)\n■ 변경 후: 08:00 ~ 21:00 (연중무휴)\n\n더욱 편리한 서비스를 위해 운영시간을 확대하였습니다. 이용에 참고하시기 바랍니다.`
      },
      {
        id: 12, category: '프로모션',
        title: '가족 여행객 대상 추가 수하물 할인 프로모션',
        date: '2026-02-18', views: 4320,
        content: `가족 단위 여행객을 위한 특별 수하물 할인 프로모션을 진행합니다.\n\n■ 대상: 동일 예약번호 내 성인 2인 + 소아 1인 이상 탑승객\n■ 혜택: 추가 수하물 1개(20kg) 50% 할인\n■ 기간: 2026년 3월 ~ 5월 탑승 기준\n■ 적용: 예약 시 '가족 수하물 할인' 선택\n\n※ 일부 특가 운임에는 적용되지 않을 수 있습니다.`
      },
      {
        id: 11, category: '안내',
        title: '마일리지 적립률 변경 안내',
        date: '2026-02-15', views: 2890,
        content: `2026년 4월 1일부터 마일리지 적립률이 일부 변경됩니다.\n\n■ 국내선: 기존 50마일 → 변경 후 운임의 10% 적립\n■ 국제선: 기존 거리 기준 → 변경 후 운임의 10~15% 적립 (등급별 상이)\n\n자세한 내용은 홈페이지 마일리지 안내 페이지를 참고해 주십시오.`
      },
      {
        id: 10, category: '신규',
        title: '부산-제주 노선 신규 취항 안내',
        date: '2026-02-10', views: 5640,
        content: `2026년 4월 1일부터 부산(김해)-제주 노선을 신규 취항합니다.\n\n■ 노선: 김해공항 ↔ 제주국제공항\n■ 운항 횟수: 일 2회 왕복 (추후 증편 예정)\n■ 출발 시간: 07:30 / 14:00 (제주 출발 기준)\n\n얼리버드 특가 항공권은 홈페이지에서 선착순 구매 가능합니다.`
      },
      {
        id: 9, category: '중요',
        title: '태풍 등 기상 악화 시 운항 지연/결항 안내 기준',
        date: '2026-02-05', views: 3100,
        content: `기상 악화로 인한 운항 지연 및 결항 시 다음 기준에 따라 처리됩니다.\n\n■ 결항 확정 시: 수수료 없이 전액 환불 또는 무료 일정 변경\n■ 지연 3시간 이상: 기내식 또는 식사 쿠폰 제공\n■ 지연 5시간 이상: 숙박 및 교통편 지원 (공항 대기 시)\n\n기상 상황에 따라 처리 기준이 달라질 수 있으며, 자세한 사항은 고객센터로 문의해 주십시오.`
      },
      {
        id: 8, category: '안내',
        title: '모바일 탑승권 이용 확대 안내',
        date: '2026-01-30', views: 2450,
        content: `제주항공 모바일 탑승권 서비스를 전 노선으로 확대합니다.\n\n■ 적용 노선: 국내선 전 노선\n■ 이용 방법: 온라인 체크인 후 앱에서 QR코드 저장\n■ 혜택: 모바일 탑승권 이용 시 마일리지 50마일 추가 적립\n\n종이 탑승권 없이 스마트폰만으로 편리하게 탑승하세요.`
      },
      {
        id: 7, category: '이벤트',
        title: '제주항공 회원 대상 렌터카 할인 제휴 이벤트',
        date: '2026-01-25', views: 3780,
        content: `제주항공 회원이라면 제주렌터카를 더욱 저렴하게 이용하세요!\n\n■ 혜택: 렌터카 대여 요금 15% 할인\n■ 대상: 제주항공 회원 (등급 무관)\n■ 적용 방법: 제주렌터카 예약 시 제주항공 회원번호 입력\n■ 기간: 2026년 3월 31일까지\n\n제주 여행을 더욱 알차게 즐기세요.`
      },
      {
        id: 6, category: '안내',
        title: '기내 와이파이 서비스 시범 운영 개시',
        date: '2026-01-20', views: 4120,
        content: `제주항공이 기내 와이파이 서비스를 시범 운영합니다.\n\n■ 시범 노선: 제주-김포 일부 편 (B737-800 기종)\n■ 요금: 30분 5,000원 / 1시간 8,000원\n■ 이용 방법: 탑승 후 기내 안내에 따라 접속\n\n시범 운영 기간 중 이용 후기를 남겨주시면 마일리지를 적립해 드립니다.`
      },
      {
        id: 5, category: '변경',
        title: '반려동물 동반 탑승 규정 변경 안내',
        date: '2026-01-15', views: 2980,
        content: `2026년 3월 1일부터 반려동물 동반 탑승 규정이 변경됩니다.\n\n■ 변경 전: 케이지 포함 7kg 이하\n■ 변경 후: 케이지 포함 8kg 이하 (소형 반려동물 1마리)\n■ 추가 변경: 반려동물 전용 좌석 지정 서비스 도입 (유료)\n\n사전 예약 필수이며, 당일 예약은 불가합니다.`
      },
      {
        id: 4, category: '중요',
        title: '유류할증료 변동 사전 안내',
        date: '2026-01-10', views: 3560,
        content: `국제 유가 변동에 따라 2026년 3월 1일부터 유류할증료가 조정됩니다.\n\n■ 국내선: 현행 유지\n■ 국제선: 구간별 상이 (홈페이지 운임 안내 참고)\n\n유류할증료는 유가에 따라 매월 조정될 수 있으며, 예약 시점의 금액이 적용됩니다.`
      },
      {
        id: 3, category: '프로모션',
        title: '얼리버드 특가 항공권 오픈 (선착순)',
        date: '2026-01-05', views: 8920,
        content: `2026년 여름 성수기 얼리버드 특가 항공권을 선착순으로 오픈합니다.\n\n■ 판매 기간: 2026년 1월 5일 ~ 1월 31일\n■ 탑승 기간: 2026년 7월 1일 ~ 8월 31일\n■ 대상 노선: 국내선 전 노선\n■ 할인율: 최대 40%\n\n수량이 한정되어 있으니 서두르세요!`
      },
      {
        id: 2, category: '신규',
        title: '제주-김포 노선 증편 운항 안내',
        date: '2025-12-30', views: 5210,
        content: `여행 수요 증가에 따라 제주-김포 노선을 증편 운항합니다.\n\n■ 증편 시작일: 2026년 3월 1일\n■ 증편 횟수: 일 2회 추가 (기존 8회 → 10회)\n■ 추가 출발 시간: 06:30 / 21:30 (제주 출발 기준)\n\n더욱 다양한 시간대에 편리하게 이용하세요.`
      },
      {
        id: 1, category: '안내',
        title: '시스템 정기 점검 안내 (매월 첫째 주 수요일 02:00-04:00)',
        date: '2025-12-20', views: 1230,
        content: `안정적인 서비스 제공을 위해 정기 시스템 점검을 실시합니다.\n\n■ 점검 일정: 매월 첫째 주 수요일 02:00 ~ 04:00\n■ 점검 내용: 예약 시스템 및 서버 유지보수\n■ 영향: 점검 시간 동안 홈페이지 및 앱 이용 불가\n\n점검 시간 외에는 정상 운영되오니 이용에 참고하시기 바랍니다.`
      },
    ],
    faqs: [
      { q: '항공권 예약 취소 및 변경은 어떻게 하나요?', a: '홈페이지 및 모바일 앱 \'마이페이지 > 예약 조회\'에서 직접 변경/취소 가능하며, 구매처 및 운임 규정에 따라 수수료가 발생할 수 있습니다.' },
      { q: '무료 수하물 규정은 어떻게 되나요?', a: '국내선 기준 1인당 15kg까지 무료 위탁 가능하며, 자세한 내용은 홈페이지 \'서비스 안내 > 수하물\'을 참고해 주십시오.' },
      { q: '온라인 체크인은 언제부터 가능한가요?', a: '출발 24시간 전부터 1시간 전까지 홈페이지 및 모바일 앱을 통해 가능합니다.' },
      { q: '반려동물과 함께 탑승하고 싶어요.', a: '케이지를 포함한 무게 8kg 이하의 반려동물 1마리에 한해 기내 동반 탑승이 가능하며, 사전 예약이 필요합니다.' },
      { q: '마일리지는 어떻게 적립하고 사용하나요?', a: '탑승 완료 후 자동 적립되며, 항공권 예매 또는 제휴사 이용 시 현금처럼 사용 가능합니다.' },
      { q: '유아 동반 시 어떤 서비스를 받을 수 있나요?', a: '국내선 이용 시 별도 좌석 지정 없는 유아는 무료 탑승 가능하며, 유모차는 위탁 수하물로 무료 처리됩니다.' },
      { q: '기내식은 제공되나요?', a: '현재 단거리 노선에서는 유료 스낵 및 음료만 판매하고 있습니다.' },
      { q: '좌석 지정은 유료인가요?', a: '일반석은 무료 지정 가능하나, 비상구석 및 앞 좌석 등 선호 좌석은 추가 요금이 발생합니다.' },
      { q: '탑승 수속 마감 시간은 언제인가요?', a: '항공기 출발 20분 전까지 탑승 수속 및 수하물 위탁을 완료하셔야 합니다.' },
      { q: '신분증을 분실했는데 탑승할 수 있나요?', a: '공항 내 무인민원발급기에서 발급한 임시 신분증명서로 대체 가능합니다.' },
      { q: '스포츠 장비(골프백, 자전거)도 위탁 가능한가요?', a: '특수 수하물 규정에 따라 별도 포장 및 요금 적용 후 위탁 가능합니다.' },
      { q: '임산부인데 탑승에 제한이 있나요?', a: '임신 32주 미만은 제약 없이 탑승 가능하며, 32주 이상 시 의사 소견서가 필요합니다.' },
      { q: '비회원도 예매가 가능한가요?', a: '네, 비회원 예매 메뉴를 통해 이름과 연락처 인증 후 예매 가능합니다.' },
      { q: '모바일 탑승권은 어떻게 사용하나요?', a: '온라인 체크인 완료 후 발급된 QR코드를 저장하여 탑승 시 제시하시면 됩니다.' },
      { q: '기상 악화로 결항 시 환불 절차는 어떻게 되나요?', a: '결항 확정 시 수수료 없이 전액 환불 처리되며, 홈페이지/앱에서 직접 신청 가능합니다.' },
    ]
  },

  stay: {
    brand: '제주스테이',
    notices: [
      {
        id: 15, category: '이벤트',
        title: '\'호캉스 패키지\' 출시 (조식+수영장+레이트 체크아웃)',
        date: '2026-02-28', views: 3210,
        content: `제주스테이의 프리미엄 호캉스 패키지를 출시합니다.\n\n■ 패키지 구성\n  - 조식 뷔페 2인 포함\n  - 야외 수영장 무제한 이용\n  - 레이트 체크아웃 (14:00까지)\n  - 웰컴 드링크 2잔\n\n■ 가격: 객실 요금 + 1인당 30,000원 추가\n■ 예약: 홈페이지 또는 고객센터 문의\n\n특별한 제주 여행을 더욱 풍성하게 즐기세요.`
      },
      {
        id: 14, category: '중요',
        title: '객실 내 흡연 시 과태료 및 추가 청소비 부과 안내',
        date: '2026-02-25', views: 1890,
        content: `전 객실 및 공용 공간은 금연 구역입니다.\n\n■ 객실 내 흡연 적발 시: 추가 청소비 100,000원 부과\n■ 화재 감지기 훼손 시: 실비 변상 및 법적 조치\n■ 흡연 가능 구역: 지정된 야외 흡연 구역에서만 가능\n\n쾌적한 환경 유지를 위해 협조해 주시기 바랍니다.`
      },
      {
        id: 13, category: '안내',
        title: '고객센터 채팅 상담 서비스 오픈',
        date: '2026-02-20', views: 2340,
        content: `보다 빠르고 편리한 상담을 위해 채팅 상담 서비스를 오픈합니다.\n\n■ 운영 시간: 09:00 ~ 22:00 (연중무휴)\n■ 이용 방법: 홈페이지 우측 하단 챗봇 버튼 클릭\n■ 상담 가능 내용: 예약 문의, 부대시설 안내, 불편사항 접수 등\n\n전화 연결이 어려운 경우 채팅 상담을 이용해 주세요.`
      },
      {
        id: 12, category: '프로모션',
        title: '제주항공 탑승객 대상 숙박료 10% 할인',
        date: '2026-02-18', views: 4560,
        content: `제주항공 탑승객이라면 제주스테이를 더욱 저렴하게 이용하세요!\n\n■ 혜택: 숙박 요금 10% 할인\n■ 대상: 제주항공 탑승 후 30일 이내 체크인 고객\n■ 적용 방법: 예약 시 항공권 예약번호 입력\n■ 기간: 상시 운영\n\n제주항공과 제주스테이로 완벽한 제주 여행을 계획하세요.`
      },
      {
        id: 11, category: '안내',
        title: '호텔 내 무료 셔틀버스 노선 및 시간표 안내',
        date: '2026-02-15', views: 2780,
        content: `투숙객을 위한 무료 셔틀버스를 운행합니다.\n\n■ 노선: 제주공항 ↔ 제주스테이 본관\n■ 운행 시간: 07:00 ~ 22:00 (1시간 간격)\n■ 소요 시간: 약 20분\n■ 탑승 방법: 공항 1층 5번 출구 앞 셔틀 정류장\n\n사전 예약 없이 이용 가능하며, 만석 시 다음 셔틀을 이용해 주세요.`
      },
      {
        id: 10, category: '신규',
        title: '전기차 충전 시설 확충 완료 안내',
        date: '2026-02-10', views: 1920,
        content: `투숙객의 편의를 위해 전기차 충전 시설을 대폭 확충하였습니다.\n\n■ 충전기 수: 기존 4기 → 12기로 확대\n■ 충전 속도: 급속 4기, 완속 8기\n■ 이용 요금: 투숙객 무료 (1박 1회 한정)\n■ 위치: 지하 주차장 B1 전용 구역\n\n전기차 이용 고객분들의 많은 이용 바랍니다.`
      },
      {
        id: 9, category: '중요',
        title: '부대시설(피트니스, 라운지) 이용 안내',
        date: '2026-02-05', views: 2150,
        content: `부대시설 이용 시 다음 사항을 참고해 주십시오.\n\n■ 피트니스 센터: 06:00 ~ 22:00 (투숙객 무료)\n■ 비즈니스 라운지: 08:00 ~ 20:00 (투숙객 무료)\n■ 야외 수영장: 10:00 ~ 19:00 (성인 전용 시간대 별도 운영)\n\n각 시설 이용 시 객실 카드키를 지참해 주십시오.`
      },
      {
        id: 8, category: '안내',
        title: '전 객실 넷플릭스 시청 가능 스마트 TV 설치 완료',
        date: '2026-01-30', views: 3890,
        content: `투숙객의 편의를 위해 전 객실에 스마트 TV를 설치하였습니다.\n\n■ 이용 가능 서비스: 넷플릭스, 유튜브, 웨이브 등\n■ 이용 방법: TV 전원 켜기 → 원하는 앱 선택 → 개인 계정 로그인\n■ 주의사항: 개인 계정 이용 후 반드시 로그아웃 해주세요.\n\n쾌적한 객실에서 다양한 콘텐츠를 즐기세요.`
      },
      {
        id: 7, category: '이벤트',
        title: '제주스테이 이용 후기 작성 시 숙박권 추첨 증정',
        date: '2026-01-25', views: 4230,
        content: `이용 후기를 작성해 주신 고객님께 감사의 선물을 드립니다.\n\n■ 이벤트 기간: 2026년 2월 1일 ~ 3월 31일\n■ 참여 방법: 체크아웃 후 홈페이지 후기 작성\n■ 경품: 1박 숙박권 (월 5명 추첨)\n■ 당첨 발표: 매월 말일\n\n진솔한 후기가 다른 고객님께 큰 도움이 됩니다.`
      },
      {
        id: 6, category: '안내',
        title: '\'친환경 여행\' 캠페인 동참 안내 (일회용품 줄이기)',
        date: '2026-01-20', views: 1650,
        content: `제주스테이는 환경 보호를 위한 친환경 여행 캠페인에 동참합니다.\n\n■ 주요 변경 사항\n  - 일회용 어메니티 제공 중단 (샴푸, 컨디셔너 등 고정 비치로 전환)\n  - 객실 내 플라스틱 컵 → 유리컵으로 교체\n  - 수건/침구 교체 주기 조정 (연박 시 격일 교체)\n\n■ 참여 혜택: 수건 교체 미신청 시 1박당 포인트 500점 적립\n\n함께 아름다운 제주를 지켜주세요.`
      },
      {
        id: 5, category: '변경',
        title: '조식 뷔페 운영 시간 변경 안내 (07:00-10:00)',
        date: '2026-01-15', views: 2340,
        content: `조식 뷔페 운영 시간이 변경됩니다.\n\n■ 변경 전: 07:30 ~ 10:30\n■ 변경 후: 07:00 ~ 10:00\n\n이른 출발 고객님의 편의를 위해 시작 시간을 앞당겼습니다. 종료 시간도 30분 앞당겨지오니 이용에 참고하시기 바랍니다.`
      },
      {
        id: 4, category: '중요',
        title: '야외 수영장 정기 안전 점검 실시 (매주 월요일 오전)',
        date: '2026-01-10', views: 1780,
        content: `투숙객의 안전을 위해 야외 수영장 정기 안전 점검을 실시합니다.\n\n■ 점검 일정: 매주 월요일 09:00 ~ 11:00\n■ 점검 내용: 수질 검사, 안전 장비 점검, 시설 유지보수\n■ 점검 중 이용 불가\n\n안전한 수영장 이용을 위해 양해 부탁드립니다.`
      },
      {
        id: 3, category: '프로모션',
        title: '2박 이상 연박 시 15% 할인 프로모션',
        date: '2026-01-05', views: 5670,
        content: `제주스테이에서 더 오래 머물수록 더 많이 할인됩니다!\n\n■ 할인율\n  - 2박: 10% 할인\n  - 3박 이상: 15% 할인\n■ 적용 기간: 2026년 1월 ~ 3월 체크인 기준\n■ 적용 방법: 예약 시 자동 적용\n\n제주의 아름다운 자연을 여유롭게 즐기세요.`
      },
      {
        id: 2, category: '신규',
        title: '서귀포점 신규 오픈! 오션뷰 객실 특가 이벤트',
        date: '2025-12-30', views: 7890,
        content: `제주스테이 서귀포점이 새롭게 오픈합니다!\n\n■ 오픈일: 2026년 3월 1일\n■ 위치: 서귀포시 중문관광단지 내\n■ 객실 수: 총 120실 (오션뷰 80실, 마운틴뷰 40실)\n■ 특가 이벤트: 오픈 기념 30% 할인 (선착순 50실)\n\n아름다운 서귀포 바다를 객실에서 바라보세요.`
      },
      {
        id: 1, category: '안내',
        title: '제주스테이 멤버십 등급 및 혜택 개편 안내',
        date: '2025-12-20', views: 3120,
        content: `2026년 1월 1일부터 멤버십 등급 및 혜택이 개편됩니다.\n\n■ 등급 체계: 일반 → 실버 → 골드 → 플래티넘\n■ 등급 기준: 연간 누적 숙박 박수 기준\n  - 실버: 5박 이상\n  - 골드: 15박 이상\n  - 플래티넘: 30박 이상\n■ 주요 혜택: 등급별 할인, 조기 체크인/레이트 체크아웃, 업그레이드 등\n\n자세한 내용은 홈페이지 멤버십 안내 페이지를 참고해 주십시오.`
      },
    ],
    faqs: [
      { q: '체크인/체크아웃 시간은 어떻게 되나요?', a: '체크인은 15:00부터, 체크아웃은 11:00까지입니다.' },
      { q: '예약 취소 및 변경 규정은 어떻게 되나요?', a: '체크인 3일 전까지 무료 취소 가능하며, 이후에는 위약금이 발생합니다. 자세한 내용은 예약 확인 페이지를 참고해 주세요.' },
      { q: '객실 내에서 취사가 가능한가요?', a: '안전상의 이유로 전 객실 내 취사는 불가합니다. 일부 스위트 객실에 전자레인지가 비치되어 있습니다.' },
      { q: '주차는 무료인가요?', a: '투숙객은 투숙 기간 동안 무료로 주차장을 이용하실 수 있습니다.' },
      { q: '엑스트라 베드 추가가 가능한가요?', a: '일부 객실 타입에 한해 가능하며, 추가 요금이 발생합니다. 예약 시 요청사항에 기재해 주십시오.' },
      { q: '호텔 내 편의시설에는 무엇이 있나요?', a: '피트니스 센터, 비즈니스 라운지, 야외 수영장, 편의점 등이 있습니다.' },
      { q: '짐 보관 서비스가 가능한가요?', a: '체크인 전 또는 체크아웃 후에 프런트 데스크에서 무료로 짐을 보관해 드립니다.' },
      { q: '영유아 동반 시 아기 침대 대여가 가능한가요?', a: '네, 사전 요청 시 무료로 대여 가능하나 수량이 한정되어 있습니다.' },
      { q: '조식은 꼭 신청해야 하나요?', a: '조식 불포함 상품 예약 후, 현장에서 추가 결제하여 이용하실 수도 있습니다.' },
      { q: '공항에서 호텔까지 가는 방법이 궁금합니다.', a: '무료 셔틀버스(07:00~22:00, 1시간 간격) 또는 택시 이용을 권장하며, 자세한 노선은 홈페이지 \'오시는 길\'을 참고해 주십시오.' },
      { q: '객실 타입별 차이점은 무엇인가요?', a: '객실 크기, 침대 타입(더블/트윈), 뷰(시티/오션) 등에 차이가 있습니다. 홈페이지 \'객실 안내\'에서 확인 가능합니다.' },
      { q: '예약 시 결제는 언제 이루어지나요?', a: '예약 확정 시점에 등록된 카드로 결제가 이루어집니다.' },
      { q: '호텔 근처에 가볼 만한 곳이 있나요?', a: '각 지점별 주변 관광지 정보는 프런트 데스크에 비치된 안내 지도를 참고해 주십시오.' },
      { q: '와이파이는 무료인가요?', a: '전 객실 및 공용 공간에서 무료로 와이파이를 이용하실 수 있습니다.' },
      { q: '분실물이 생겼을 경우 어떻게 해야 하나요?', a: '고객센터로 연락 주시면 확인 후 처리해 드립니다. 분실물은 규정에 따라 3개월간 보관 후 폐기됩니다.' },
    ]
  },

  car: {
    brand: '제주렌터카',
    notices: [
      {
        id: 15, category: '이벤트',
        title: '이용 후기 작성 고객 대상 주유권 증정 이벤트',
        date: '2026-02-28', views: 2890,
        content: `제주렌터카 이용 후 후기를 남겨주신 고객님께 주유권을 드립니다.\n\n■ 이벤트 기간: 2026년 3월 1일 ~ 3월 31일\n■ 참여 방법: 반납 후 홈페이지 후기 작성 (사진 포함)\n■ 경품: 5만원 주유권 (선착순 100명)\n■ 지급 방법: 이메일 발송\n\n진솔한 후기로 다른 고객님께 도움을 주세요.`
      },
      {
        id: 14, category: '중요',
        title: '차량 반납 시간 초과 시 추가 요금 정책 안내',
        date: '2026-02-25', views: 3120,
        content: `차량 반납 시간 초과 시 다음과 같이 추가 요금이 부과됩니다.\n\n■ 30분 이내 초과: 해당 차종 일일 요금의 10%\n■ 30분 ~ 1시간 초과: 해당 차종 일일 요금의 20%\n■ 1시간 초과: 1일 추가 대여 요금 전액 부과\n\n반납 시간 연장이 필요한 경우 반드시 반납 전에 고객센터로 연락해 주십시오.`
      },
      {
        id: 13, category: '안내',
        title: '고객센터 유선 상담 ARS 메뉴 개편',
        date: '2026-02-20', views: 1450,
        content: `보다 빠른 상담 연결을 위해 ARS 메뉴를 개편합니다.\n\n■ 변경 일: 2026년 3월 1일\n■ 주요 변경 내용\n  - 1번: 예약 문의 및 변경\n  - 2번: 사고/긴급 지원\n  - 3번: 요금 및 결제 문의\n  - 4번: 기타 문의\n\n더욱 빠른 상담 연결을 위해 노력하겠습니다.`
      },
      {
        id: 12, category: '프로모션',
        title: '전기차 대여 고객 대상 충전 카드 무료 제공',
        date: '2026-02-18', views: 4230,
        content: `전기차 대여 고객님께 충전 카드를 무료로 제공합니다.\n\n■ 대상: 전기차(아이오닉6, EV9 등) 대여 고객 전체\n■ 혜택: 제주 전역 지정 충전소 무료 충전 (1일 1회, 최대 50kWh)\n■ 이용 방법: 차량 인수 시 충전 카드 함께 수령\n\n친환경 전기차로 제주를 더욱 스마트하게 여행하세요.`
      },
      {
        id: 11, category: '안내',
        title: '외국인 운전자 국제운전면허증 필수 지참 안내',
        date: '2026-02-15', views: 2340,
        content: `외국인 고객님의 차량 대여 시 필수 서류를 안내드립니다.\n\n■ 필수 서류: 유효한 국제운전면허증 + 여권\n■ 주의사항: 국제운전면허증만으로는 대여 불가 (여권 반드시 동반)\n■ 일부 국가 면허증: 별도 공증 서류 필요 (사전 문의 권장)\n\n서류 미비 시 차량 대여가 불가하오니 반드시 사전에 확인해 주십시오.`
      },
      {
        id: 10, category: '신규',
        title: '카시트, 유모차 대여 서비스 품질 개선',
        date: '2026-02-10', views: 1980,
        content: `영유아 동반 고객님의 안전을 위해 카시트 및 유모차 대여 서비스를 개선합니다.\n\n■ 개선 내용\n  - 카시트 전 제품 신규 교체 (2026년형)\n  - 유모차 추가 구비 (기존 10대 → 20대)\n  - 소독 및 위생 관리 강화\n\n■ 대여 요금: 카시트 1일 5,000원 / 유모차 1일 3,000원\n\n예약 시 옵션에서 선택해 주세요.`
      },
      {
        id: 9, category: '중요',
        title: '운전면허증 미지참 시 차량 대여 불가 안내',
        date: '2026-02-05', views: 2780,
        content: `도로교통법 및 보험 규정에 따라 유효한 운전면허증을 소지하지 않은 경우 차량 대여가 불가합니다.\n\n■ 필수 지참: 유효한 운전면허증 (만료된 면허증 불가)\n■ 추가 운전자: 추가 운전자 모두 면허증 지참 필수\n\n면허증 미지참 시 예약이 있더라도 차량 인수가 불가하오니 반드시 확인해 주십시오.`
      },
      {
        id: 8, category: '안내',
        title: '모든 차량 금연 의무화 시행',
        date: '2026-01-30', views: 2120,
        content: `2026년 2월 1일부터 모든 차량 내 흡연이 전면 금지됩니다.\n\n■ 적용 범위: 전 차종\n■ 위반 시: 추가 청소비 50,000원 부과 및 향후 대여 제한\n■ 흡연 흔적 감지 방법: 차량 반납 시 전담 직원 확인\n\n쾌적한 차량 환경을 위해 협조해 주시기 바랍니다.`
      },
      {
        id: 7, category: '이벤트',
        title: '제주스테이 숙박객 대상 렌터카 20% 할인',
        date: '2026-01-25', views: 5340,
        content: `제주스테이 투숙객이라면 제주렌터카를 20% 할인된 가격으로 이용하세요!\n\n■ 혜택: 렌터카 대여 요금 20% 할인\n■ 대상: 제주스테이 투숙 확인 고객\n■ 적용 방법: 렌터카 예약 시 제주스테이 예약번호 입력\n■ 기간: 상시 운영\n\n제주스테이와 제주렌터카로 완벽한 제주 여행을 즐기세요.`
      },
      {
        id: 6, category: '안내',
        title: '비대면 차량 인수/반납 서비스 도입',
        date: '2026-01-20', views: 3890,
        content: `고객 편의를 위해 비대면 차량 인수/반납 서비스를 도입합니다.\n\n■ 서비스 내용: 앱을 통한 차량 잠금 해제 및 반납 처리\n■ 이용 가능 시간: 24시간\n■ 이용 방법: 앱 설치 → 예약 확인 → QR코드로 차량 잠금 해제\n■ 주의사항: 차량 상태 사진 촬영 필수 (인수/반납 시)\n\n야간 및 이른 아침 출발 고객님께 특히 유용합니다.`
      },
      {
        id: 5, category: '변경',
        title: '셔틀버스 운행 간격 및 시간표 변경 안내',
        date: '2026-01-15', views: 2450,
        content: `공항 셔틀버스 운행 시간표가 변경됩니다.\n\n■ 변경 전: 15분 간격 운행\n■ 변경 후: 10분 간격 운행 (성수기 기준)\n■ 운행 시간: 06:00 ~ 23:00\n■ 탑승 위치: 제주공항 1층 5번 게이트 앞\n\n더욱 빠르고 편리한 셔틀 서비스를 이용하세요.`
      },
      {
        id: 4, category: '중요',
        title: '완전자차 보험 보장 범위 확대 안내',
        date: '2026-01-10', views: 3670,
        content: `완전자차 보험의 보장 범위가 확대됩니다.\n\n■ 변경 전: 차량 파손 시 자기부담금 30만원\n■ 변경 후: 자기부담금 0원 (완전 면책)\n■ 추가 보장: 타이어 펑크, 유리 파손 포함\n■ 적용 일: 2026년 2월 1일 이후 예약 건\n\n안심하고 제주를 드라이브하세요.`
      },
      {
        id: 3, category: '프로모션',
        title: '3일 이상 대여 시 1일 요금 무료 이벤트',
        date: '2026-01-05', views: 6780,
        content: `장기 대여 고객님께 특별 혜택을 드립니다.\n\n■ 혜택: 3일 이상 대여 시 1일 요금 무료\n■ 적용 기간: 2026년 1월 ~ 3월 대여 기준\n■ 적용 방법: 예약 시 자동 할인 적용\n■ 대상 차종: 전 차종\n\n제주를 여유롭게 즐기세요!`
      },
      {
        id: 2, category: '신규',
        title: '제주공항 지점 확장 이전 안내',
        date: '2025-12-30', views: 4560,
        content: `제주공항 지점이 더 넓고 편리한 위치로 이전합니다.\n\n■ 이전일: 2026년 3월 1일\n■ 새 주소: 제주시 공항로 2 (공항 인근 신축 건물)\n■ 주요 변경: 주차 공간 확대, 대기 공간 개선, 카페 입점\n\n더욱 쾌적한 환경에서 렌터카 서비스를 이용하세요.`
      },
      {
        id: 1, category: '안내',
        title: '2026년 신형 전기차(아이오닉6, EV9) 입고 완료',
        date: '2025-12-20', views: 5890,
        content: `2026년형 신형 전기차를 새롭게 선보입니다.\n\n■ 신규 입고 차량\n  - 현대 아이오닉6 (1회 충전 524km 주행)\n  - 기아 EV9 (7인승, 1회 충전 501km 주행)\n■ 대여 요금: 홈페이지 차량 안내 페이지 참고\n■ 충전 카드: 대여 시 무료 제공\n\n최신 전기차로 친환경 제주 여행을 즐기세요.`
      },
    ],
    faqs: [
      { q: '렌터카 예약은 어떻게 하나요?', a: '홈페이지 및 모바일 앱에서 원하는 날짜, 차종을 선택하여 실시간으로 예약 가능합니다.' },
      { q: '예약 취소 및 환불 규정은 어떻게 되나요?', a: '인수 24시간 전까지 무료 취소 가능하며, 이후에는 수수료가 부과됩니다.' },
      { q: '운전자 자격 조건은 어떻게 되나요?', a: '만 21세 이상, 운전 경력 1년 이상이어야 하며, 유효한 운전면허증을 소지해야 합니다.' },
      { q: '자동차 보험(자차)은 꼭 가입해야 하나요?', a: '사고 시 부담을 줄이기 위해 일반자차 또는 완전자차 보험 가입을 강력히 권장합니다.' },
      { q: '공항에서 렌터카는 어떻게 인수받나요?', a: '제주공항 도착 후 1층 5번 게이트로 나오셔서 지정된 구역의 셔틀버스를 타고 본사로 이동하여 차량을 인수합니다.' },
      { q: '추가 운전자 등록이 가능한가요?', a: '네, 최대 2인까지 가능하며, 등록할 운전자 모두 운전면허증을 지참하고 함께 방문해야 합니다.' },
      { q: '내비게이션, 카시트는 기본으로 제공되나요?', a: '내비게이션은 전 차량 기본 장착되어 있으며, 카시트와 유모차는 예약 시 옵션으로 선택(유료)해야 합니다.' },
      { q: '차량 반납은 어디에 하나요?', a: '렌터카 본사(차량 인수 장소)로 반납하며, 이후 셔틀버스를 이용해 공항으로 이동하시면 됩니다.' },
      { q: '연료는 어떻게 처리하나요?', a: '차량 인수 시 가득 채워진 상태로 제공되며, 반납 시에도 동일한 양으로 채워서 반납하는 것이 기본 원칙입니다.' },
      { q: '사고 발생 시 어떻게 대처해야 하나요?', a: '즉시 운행을 중단하고 고객센터로 연락하여 안내에 따라 대처해야 합니다. 임의 처리 시 보험 적용이 불가할 수 있습니다.' },
      { q: '대여 기간 연장이 가능한가요?', a: '다음 예약이 없는 경우 가능하며, 반드시 반납 시간 이전에 고객센터를 통해 연장 신청을 해야 합니다.' },
      { q: '전기차 충전은 어떻게 하나요?', a: '차량과 함께 제공되는 충전 카드를 이용해 지정된 충전소에서 무료 또는 저렴하게 충전할 수 있습니다.' },
      { q: '반려동물 동반 탑승이 가능한가요?', a: '전용 케이지 사용 시 동반 탑승이 가능하나, 차량 오염 및 손상 시 세차 비용이 청구될 수 있습니다.' },
      { q: '차량 인수 시 필요한 서류는 무엇인가요?', a: '예약자 본인의 유효한 운전면허증이 반드시 필요합니다.' },
      { q: '국제운전면허증으로도 대여가 가능한가요?', a: '네, 유효한 국제운전면허증과 여권을 함께 지참하시면 대여 가능합니다.' },
    ]
  }
};

/* =====================================================
   상태 관리
   ===================================================== */
const state = {
  currentBrand: 'air',
  pages: { air: 1, stay: 1, car: 1 },
  filters: { air: 'all', stay: 'all', car: 'all' },
};

/* =====================================================
   초기화
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderAll('air');
  renderAll('stay');
  renderAll('car');
  initChatbotInput();
});

function renderAll(brand) {
  renderNoticeTable(brand);
  renderFaq(brand);
}

/* =====================================================
   브랜드 탭 전환
   ===================================================== */
function switchBrand(brand) {
  // 탭 버튼 상태
  document.querySelectorAll('.hc-tab').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  const activeTab = document.getElementById(`tab-${brand}`);
  activeTab.classList.add('active');
  activeTab.setAttribute('aria-selected', 'true');

  // 패널 표시
  document.querySelectorAll('.hc-panel').forEach(panel => {
    panel.classList.remove('active');
    panel.hidden = true;
  });
  const activePanel = document.getElementById(`panel-${brand}`);
  activePanel.classList.add('active');
  activePanel.hidden = false;

  state.currentBrand = brand;

  // 상단으로 스크롤
  document.getElementById('hc-brand-tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =====================================================
   공지사항 게시판 렌더링
   ===================================================== */
function getFilteredNotices(brand) {
  const filter = state.filters[brand];
  const notices = HC_DATA[brand].notices;
  if (filter === 'all') return notices;
  return notices.filter(n => n.category === filter);
}

function renderNoticeTable(brand) {
  const filtered = getFilteredNotices(brand);
  const page = state.pages[brand];
  const total = filtered.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const items = filtered.slice(start, start + ITEMS_PER_PAGE);

  const tbody = document.getElementById(`${brand}-notice-body`);

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="hc-empty"><div class="hc-empty__icon">📭</div>해당하는 공지사항이 없습니다.</div></td></tr>`;
  } else {
    tbody.innerHTML = items.map((notice, idx) => `
      <tr>
        <td>${total - start - idx}</td>
        <td><span class="hc-badge hc-badge--${notice.category}">${notice.category}</span></td>
        <td class="hc-board-td--title" onclick="openNoticeModal('${brand}', ${notice.id})" tabindex="0" role="button" aria-label="${notice.title} 상세 보기">${notice.title}</td>
        <td>${notice.date}</td>
        <td>${notice.views.toLocaleString()}</td>
      </tr>
    `).join('');
  }

  // 페이지네이션
  renderPagination(brand, page, totalPages);
}

function renderPagination(brand, currentPage, totalPages) {
  const container = document.getElementById(`${brand}-notice-pagination`);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = '';
  // 이전
  html += `<button class="hc-page-btn" onclick="changePage('${brand}', ${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} aria-label="이전 페이지">‹</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="hc-page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage('${brand}', ${i})" aria-label="${i}페이지" aria-current="${i === currentPage ? 'page' : 'false'}">${i}</button>`;
  }

  // 다음
  html += `<button class="hc-page-btn" onclick="changePage('${brand}', ${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} aria-label="다음 페이지">›</button>`;

  container.innerHTML = html;
}

function changePage(brand, page) {
  const filtered = getFilteredNotices(brand);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  state.pages[brand] = page;
  renderNoticeTable(brand);
  document.getElementById(`${brand}-notice`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function filterNotice(brand) {
  const select = document.getElementById(`${brand}-notice-filter`);
  state.filters[brand] = select.value;
  state.pages[brand] = 1;
  renderNoticeTable(brand);
}

/* =====================================================
   공지사항 모달
   ===================================================== */
function openNoticeModal(brand, id) {
  /**
   * [백엔드 연동 포인트]
   * 아래 로직을 API 호출로 교체:
   * fetch(`/api/${brand}/notices/${id}`)
   *   .then(res => res.json())
   *   .then(notice => { ... 모달 렌더링 ... });
   */
  const notice = HC_DATA[brand].notices.find(n => n.id === id);
  if (!notice) return;

  // 조회수 증가 (프론트 임시 처리 - 백엔드 연동 시 API로 대체)
  notice.views += 1;
  renderNoticeTable(brand);

  document.getElementById(`${brand}-modal-badge`).innerHTML = `<span class="hc-badge hc-badge--${notice.category}">${notice.category}</span>`;
  document.getElementById(`${brand}-modal-title`).textContent = notice.title;
  document.getElementById(`${brand}-modal-date`).textContent = `등록일: ${notice.date}`;
  document.getElementById(`${brand}-modal-views`).textContent = `조회수: ${notice.views.toLocaleString()}`;
  document.getElementById(`${brand}-modal-body`).textContent = notice.content;

  const modal = document.getElementById(`${brand}-notice-modal`);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // 포커스 트랩
  setTimeout(() => modal.querySelector('.hc-modal__close').focus(), 100);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.hc-modal').forEach(m => {
      if (m.style.display === 'flex') closeModal(m.id);
    });
    closeChatbot();
  }
});

/* =====================================================
   FAQ 아코디언 렌더링
   ===================================================== */
function renderFaq(brand) {
  const container = document.getElementById(`${brand}-faq-list`);
  const faqs = HC_DATA[brand].faqs;

  container.innerHTML = faqs.map((faq, idx) => `
    <div class="hc-accordion-item" id="${brand}-faq-item-${idx}">
      <div class="hc-accordion-header" onclick="toggleFaq('${brand}', ${idx})" role="button" tabindex="0" aria-expanded="false" aria-controls="${brand}-faq-body-${idx}">
        <span class="hc-accordion-q" aria-hidden="true">Q</span>
        <span class="hc-accordion-question">${faq.q}</span>
        <span class="hc-accordion-chevron" aria-hidden="true">▼</span>
      </div>
      <div class="hc-accordion-body" id="${brand}-faq-body-${idx}" role="region">
        <div class="hc-accordion-answer">${faq.a}</div>
      </div>
    </div>
  `).join('');

  // 키보드 접근성
  container.querySelectorAll('.hc-accordion-header').forEach((header, idx) => {
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(brand, idx);
      }
    });
  });
}

function toggleFaq(brand, idx) {
  const item = document.getElementById(`${brand}-faq-item-${idx}`);
  const header = item.querySelector('.hc-accordion-header');
  const isOpen = item.classList.contains('open');

  // 같은 브랜드 내 다른 항목 닫기
  document.querySelectorAll(`#${brand}-faq-list .hc-accordion-item`).forEach(el => {
    el.classList.remove('open');
    el.querySelector('.hc-accordion-header').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
  }
}

/* =====================================================
   통합 검색
   ===================================================== */
function handleSearch() {
  const keyword = document.getElementById('hc-search-input').value.trim();
  if (!keyword) return;

  // 현재 활성 브랜드 기준 FAQ에서 검색
  const brand = state.currentBrand;
  const faqs = HC_DATA[brand].faqs;
  const lowerKeyword = keyword.toLowerCase();

  let found = false;
  faqs.forEach((faq, idx) => {
    if (faq.q.toLowerCase().includes(lowerKeyword) || faq.a.toLowerCase().includes(lowerKeyword)) {
      if (!found) {
        // 첫 번째 결과로 스크롤
        scrollToSection(`${brand}-faq`);
        setTimeout(() => toggleFaq(brand, idx), 400);
        found = true;
      }
    }
  });

  if (!found) {
    alert(`'${keyword}'에 대한 검색 결과가 없습니다.\n1:1 문의를 남겨 주세요.`);
  }
}

// 엔터 키 검색
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('hc-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
});

/* =====================================================
   유틸리티
   ===================================================== */
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    const offset = 80; // sticky 탭 높이 보정
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
