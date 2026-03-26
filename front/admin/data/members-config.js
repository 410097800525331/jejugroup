const membersConfig = {
  defaultTab: 'member',
  searchButtonLabel: '검색',
  tabs: {
    member: {
      searchPlaceholder: '회원명이나 ID로 검색',
      primaryAction: '회원 등록',
      secondaryAction: '권한 관리',
      emptyMessage: '회원 데이터가 없습니다.',
      columns: ['대상', '도메인', '기본 정보', '갱신 시각', '상태 / 깃값', '관리'],
      rows: []
    },
    membership: {
      searchPlaceholder: '멤버십명이나 회원명으로 검색',
      primaryAction: '멤버십 생성',
      secondaryAction: '갱신 요청',
      emptyMessage: '멤버십 데이터가 없습니다.',
      columns: ['대상', '도메인', '기본 정보', '갱신 시각', '상태 / 깃값', '관리'],
      rows: []
    },
    permissions: {
      searchPlaceholder: '권한명이나 역할로 검색',
      primaryAction: '권한 생성',
      secondaryAction: '권한 관리',
      emptyMessage: '권한 데이터가 없습니다.',
      columns: ['대상', '도메인', '기본 정보', '갱신 시각', '상태 / 연결', '관리'],
      rows: []
    },
    inquiries: {
      searchPlaceholder: '문의번호나 문의 제목으로 검색',
      primaryAction: '문의 등록',
      secondaryAction: '문의 상태 관리',
      emptyMessage: '문의사항 데이터가 없습니다.',
      columns: ['문의 ID', '도메인', '문의 요약', '접수 시각', '처리 상태', '관리'],
      rows: []
    }
  }
};

export default membersConfig;
