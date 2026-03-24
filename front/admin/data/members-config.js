const membersConfig = {
  defaultTab: 'member',
  tabs: {
    member: {
      searchPlaceholder: '회원명 또는 ID 검색',
      primaryAction: '멤버 등록',
      secondaryAction: '권한 관리',
      emptyMessage: '회원 데이터가 없습니다.',
      columns: ['구분', '카테고리', '기본 정보', '기준 일시', '상태 / 상태값', '관리'],
      rows: []
    },
    membership: {
      searchPlaceholder: '멤버십명 또는 회원명 검색',
      primaryAction: '멤버십 생성',
      secondaryAction: '갱신 관리',
      emptyMessage: '멤버십 데이터가 없습니다.',
      columns: ['구분', '카테고리', '기본 정보', '갱신 일시', '상태 / 상태값', '관리'],
      rows: []
    },
    permissions: {
      searchPlaceholder: '권한명 또는 식별자 검색',
      primaryAction: '권한 생성',
      secondaryAction: '권한 관리',
      emptyMessage: '권한 데이터가 없습니다.',
      columns: ['구분', '카테고리', '기본 정보', '기준 일시', '상태 / 상태값', '관리'],
      rows: []
    },
    inquiries: {
      searchPlaceholder: '문의번호 또는 문의 제목 검색',
      primaryAction: '문의 상태 관리',
      secondaryAction: 'SLA 점검',
      emptyMessage: '문의 항목 데이터가 없습니다.',
      columns: ['문의 ID', '카테고리', '문의 요약', '작성 일시', '처리 상태', '관리'],
      rows: []
    }
  }
};

membersConfig.member = membersConfig.tabs.member;
membersConfig.membership = membersConfig.tabs.membership;
membersConfig.permissions = membersConfig.tabs.permissions;
membersConfig.inquiries = membersConfig.tabs.inquiries;

export default membersConfig;
