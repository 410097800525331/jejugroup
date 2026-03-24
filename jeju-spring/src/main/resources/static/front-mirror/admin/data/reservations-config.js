const reservationsConfig = {
  defaultTab: 'booking',
  tabs: {
    booking: {
      searchPlaceholder: '예약 테이블 또는 도메인 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: '예약 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    payment: {
      searchPlaceholder: '결제 테이블 또는 도메인 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: '결제 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    refund: {
      searchPlaceholder: '환불 테이블 또는 도메인 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: '환불 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    traveler: {
      searchPlaceholder: '이용자 테이블 또는 도메인 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: '탑승객 / 이용자 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    }
  }
};

reservationsConfig.booking = reservationsConfig.tabs.booking;
reservationsConfig.payment = reservationsConfig.tabs.payment;
reservationsConfig.refund = reservationsConfig.tabs.refund;
reservationsConfig.traveler = reservationsConfig.tabs.traveler;

export default reservationsConfig;
