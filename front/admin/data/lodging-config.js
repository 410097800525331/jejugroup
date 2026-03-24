const lodgingConfig = {
  defaultTab: 'stay',
  tabs: {
    stay: {
      searchPlaceholder: 'stay 테이블 또는 역할 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: 'stay 상품 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    air: {
      searchPlaceholder: 'air 테이블 또는 역할 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: 'air 상품 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    rent: {
      searchPlaceholder: 'rent 테이블 또는 역할 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: 'rent 상품 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    voucher: {
      searchPlaceholder: 'voucher 테이블 또는 역할 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: 'voucher 상품 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    special: {
      searchPlaceholder: 'special 테이블 또는 역할 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: 'special 상품 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    },
    usim: {
      searchPlaceholder: 'usim 테이블 또는 역할 검색',
      primaryAction: '스키마 새로고침',
      secondaryAction: '현재 DB 기준',
      emptyMessage: 'usim 상품 스키마가 아직 없습니다.',
      columns: ['도메인', '기대 테이블', '역할', '현재 상태', '행 수', '근거', '관리'],
      rows: []
    }
  }
};

lodgingConfig.stay = lodgingConfig.tabs.stay;
lodgingConfig.air = lodgingConfig.tabs.air;
lodgingConfig.rent = lodgingConfig.tabs.rent;
lodgingConfig.voucher = lodgingConfig.tabs.voucher;
lodgingConfig.special = lodgingConfig.tabs.special;
lodgingConfig.usim = lodgingConfig.tabs.usim;

export default lodgingConfig;
