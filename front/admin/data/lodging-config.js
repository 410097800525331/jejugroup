const lodgingConfig = {
  defaultTab: 'stay',
  tabs: {
    stay: {
      searchPlaceholder: '숙소명 또는 코드 검색',
      primaryAction: '숙소 등록',
      secondaryAction: '재고 확인',
      emptyMessage: '숙소 상품이 없습니다.',
      columns: ['상품 코드', '카테고리', '상품명 / 옵션', '재고 / 수량', '기준가', '상태', '관리'],
      rows: []
    },
    flight: {
      searchPlaceholder: '항공편명 또는 노선 코드 검색',
      primaryAction: '좌석 확인',
      secondaryAction: '재고 확인',
      emptyMessage: '항공 상품이 없습니다.',
      columns: ['상품 코드', '카테고리', '노선 / 편명', '좌석', '기준가', '상태', '관리'],
      rows: []
    },
    rentcar: {
      searchPlaceholder: '차종 또는 차량 코드 검색',
      primaryAction: '배차 확인',
      secondaryAction: '재고 확인',
      emptyMessage: '렌터카 상품이 없습니다.',
      columns: ['상품 코드', '카테고리', '차종 / 옵션', '보유 대수', '기준가', '상태', '관리'],
      rows: []
    },
    voucher: {
      searchPlaceholder: '바우처명 또는 코드 검색',
      primaryAction: '상품 등록',
      secondaryAction: '재고 확인',
      emptyMessage: '바우처 상품이 없습니다.',
      columns: ['상품 코드', '카테고리', '바우처 / 옵션', '발행 수량', '판매가', '상태', '관리'],
      rows: []
    },
    special: {
      searchPlaceholder: '특가명 또는 쿠폰 코드 검색',
      primaryAction: '특가 생성',
      secondaryAction: '선택 확인',
      emptyMessage: '특가 / 쿠폰 데이터가 없습니다.',
      columns: ['상품 코드', '카테고리', '특가 / 쿠폰', '발행 수량', '금액', '상태', '관리'],
      rows: []
    },
    usim: {
      searchPlaceholder: '유심명 또는 코드 검색',
      primaryAction: '상품 등록',
      secondaryAction: '재고 확인',
      emptyMessage: '유심 상품이 없습니다.',
      columns: ['상품 코드', '카테고리', '유심 / 기간', '재고', '판매가', '상태', '관리'],
      rows: []
    }
  }
};

lodgingConfig.stay = lodgingConfig.tabs.stay;
lodgingConfig.flight = lodgingConfig.tabs.flight;
lodgingConfig.rentcar = lodgingConfig.tabs.rentcar;
lodgingConfig.voucher = lodgingConfig.tabs.voucher;
lodgingConfig.special = lodgingConfig.tabs.special;
lodgingConfig.usim = lodgingConfig.tabs.usim;

export default lodgingConfig;
