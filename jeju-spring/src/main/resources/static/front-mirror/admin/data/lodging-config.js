const lodgingConfig = {
  defaultTab: 'stay',
  searchButtonLabel: '검색',
  surfaceEndpoint: '/api/admin/tables/lodging',
  loadingMessage: '숙박 데이터를 불러오는 중입니다.',
  errorMessage: '숙박 데이터를 불러오지 못했습니다.',
  tabs: {
    stay: {
      searchPlaceholder: '숙박 코드나 상품명으로 검색',
      primaryAction: '숙박 등록',
      secondaryAction: '상품 일괄 등록',
      emptyMessage: '숙박 상품 데이터가 없습니다.',
      columns: ['상품 코드', '도메인', '상품명 / 옵션', '재고 / 수량', '기준가', '상태', '관리'],
      rows: []
    },
    flight: {
      searchPlaceholder: '항공 코드나 노선으로 검색',
      primaryAction: '노선 등록',
      secondaryAction: '상품 일괄 등록',
      emptyMessage: '항공 상품 데이터가 없습니다.',
      columns: ['상품 코드', '도메인', '노선 / 편명', '좌석', '기준가', '상태', '관리'],
      rows: []
    },
    rentcar: {
      searchPlaceholder: '렌터카 코드나 차종으로 검색',
      primaryAction: '차종 등록',
      secondaryAction: '상품 일괄 등록',
      emptyMessage: '렌터카 상품 데이터가 없습니다.',
      columns: ['상품 코드', '도메인', '차종 / 옵션', '보유 대수', '기준가', '상태', '관리'],
      rows: []
    },
    voucher: {
      searchPlaceholder: '바우처 코드나 상품명으로 검색',
      primaryAction: '상품 등록',
      secondaryAction: '바우처 일괄 등록',
      emptyMessage: '바우처 상품 데이터가 없습니다.',
      columns: ['상품 코드', '도메인', '바우처 / 옵션', '보유 수량', '판매가', '상태', '관리'],
      rows: []
    },
    special: {
      searchPlaceholder: '특가 코드나 상품명으로 검색',
      primaryAction: '특가 생성',
      secondaryAction: '선택 항목 확인',
      emptyMessage: '특가 / 쿠폰 데이터가 없습니다.',
      columns: ['상품 코드', '도메인', '특가 / 쿠폰', '발행 수량', '금액', '상태', '관리'],
      rows: []
    },
    usim: {
      searchPlaceholder: '유심 코드나 상품명으로 검색',
      primaryAction: '유심 등록',
      secondaryAction: '유심 확인',
      emptyMessage: '유심 상품 데이터가 없습니다.',
      columns: ['상품 코드', '도메인', '유심 / 기간', '재고', '판매가', '상태', '관리'],
      rows: []
    }
  }
};

export default lodgingConfig;
