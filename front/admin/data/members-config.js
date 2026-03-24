const membersConfig = {
  defaultTab: 'member',
  tabs: {
    member: {
      searchPlaceholder: '회원명 또는 ID 검색',
      primaryAction: '회원 DB 보기',
      secondaryAction: '새로고침',
      emptyMessage: '회원 데이터가 없습니다.',
      columns: ['사용자 ID', '구분', '기본 정보', '기준 일시', '상태 / 권한', '관리'],
      rows: []
    },
    accounts: {
      searchPlaceholder: '연동 계정 또는 provider 검색',
      primaryAction: '계정 DB 보기',
      secondaryAction: '새로고침',
      emptyMessage: '연동 계정 데이터가 없습니다.',
      columns: ['사용자 ID', '구분', '연동 정보', '최근 인증', '상태 / 기본값', '관리'],
      rows: []
    },
    permissions: {
      searchPlaceholder: '권한명 또는 식별자 검색',
      primaryAction: '권한 DB 보기',
      secondaryAction: '새로고침',
      emptyMessage: '권한 데이터가 없습니다.',
      columns: ['식별자', '구분', '기본 정보', '기준 일시', '상태 / 연결', '관리'],
      rows: []
    },
    inquiries: {
      searchPlaceholder: '문의번호 또는 문의 제목 검색',
      primaryAction: '문의 DB 보기',
      secondaryAction: '새로고침',
      emptyMessage: '문의 데이터가 없습니다.',
      columns: ['문의 ID', '서비스', '문의 요약', '작성 일시', '처리 상태', '관리'],
      rows: []
    }
  }
};

membersConfig.member = membersConfig.tabs.member;
membersConfig.accounts = membersConfig.tabs.accounts;
membersConfig.permissions = membersConfig.tabs.permissions;
membersConfig.inquiries = membersConfig.tabs.inquiries;

export default membersConfig;
