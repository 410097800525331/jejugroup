const reservationsConfig = {
  defaultTab: 'booking',
  tabs: {
    booking: {
      searchPlaceholder: '예약번호 또는 고객명 검색',
      primaryAction: '예약 내역 등록',
      secondaryAction: '예약 정리',
      emptyMessage: '예약 데이터가 없습니다.',
      columns: ['번호', '카테고리', '예약 / 결제 정보', '고객 / 연락처', '금액', '일시', '상태', '관리'],
      rows: []
    },
    payment: {
      searchPlaceholder: '결제번호 또는 주문명 검색',
      primaryAction: '수동 확인',
      secondaryAction: '정산 내역 보기',
      emptyMessage: '결제 데이터가 없습니다.',
      columns: ['번호', '카테고리', '결제 방식 / 주문', '고객 / 연락처', '확인 금액', '확인 시각', '상태', '관리'],
      rows: []
    },
    refund: {
      searchPlaceholder: '환불번호 또는 사유 검색',
      primaryAction: '환불 확인',
      secondaryAction: '취소 환불',
      emptyMessage: '환불 데이터가 없습니다.',
      columns: ['번호', '카테고리', '사유 / 요청', '고객 / 연락처', '환불액', '처리 시각', '상태', '관리'],
      rows: []
    },
    traveler: {
      searchPlaceholder: '여행자명 또는 예약번호 검색',
      primaryAction: '명단 보기',
      secondaryAction: '내역 확인',
      emptyMessage: '여행자 데이터가 없습니다.',
      columns: ['번호', '카테고리', '예약 / 이용 상품', '이용자', '체크인 / 이용일', '상태', '관리'],
      rows: []
    }
  }
};

reservationsConfig.booking = reservationsConfig.tabs.booking;
reservationsConfig.payment = reservationsConfig.tabs.payment;
reservationsConfig.refund = reservationsConfig.tabs.refund;
reservationsConfig.traveler = reservationsConfig.tabs.traveler;

export default reservationsConfig;
