const reservationsConfig = {
  defaultTab: 'booking',
  searchButtonLabel: '검색',
  surfaceEndpoint: '/api/admin/tables/reservations',
  loadingMessage: '예약 데이터를 불러오는 중입니다.',
  errorMessage: '예약 데이터를 불러오지 못했습니다.',
  domainFilters: [
    { key: 'all', label: '전체' },
    { key: 'flight', label: '항공권' },
    { key: 'hotel', label: '호텔' },
    { key: 'rentcar', label: '렌터카' },
    { key: 'voucher', label: '바우처' }
  ],
  tabs: {
    booking: {
      searchPlaceholder: '예약번호나 고객명으로 검색',
      primaryAction: '예약 등록',
      secondaryAction: '신규 요청 처리',
      emptyMessage: '예약 데이터가 없습니다.',
      columns: ['번호', '도메인', '예약 / 결제 정보', '고객 / 연락처', '금액', '시각', '상태', '관리'],
      rows: []
    },
    payment: {
      searchPlaceholder: '결제번호나 주문명으로 검색',
      primaryAction: '결제 등록',
      secondaryAction: '정산 내역 보기',
      emptyMessage: '결제 데이터가 없습니다.',
      columns: ['번호', '도메인', '결제 수단 / 주문', '고객 / 연락처', '확인 금액', '확인 시각', '상태', '관리'],
      rows: []
    },
    refund: {
      searchPlaceholder: '환불번호나 사유로 검색',
      primaryAction: '환불 승인',
      secondaryAction: '승인 대기 보기',
      emptyMessage: '환불 데이터가 없습니다.',
      columns: ['번호', '도메인', '환불 / 사유', '고객 / 연락처', '환불액', '처리 시각', '상태', '관리'],
      rows: []
    },
    traveler: {
      searchPlaceholder: '이용자나 탑승객 정보로 검색',
      primaryAction: '명단 등록',
      secondaryAction: '이용자 확인',
      emptyMessage: '탑승객 / 이용자 데이터가 없습니다.',
      columns: ['번호', '도메인', '예약 / 이용 상품', '이용자', '체크인 / 이용', '상태', '관리'],
      rows: []
    }
  }
};

export default reservationsConfig;
