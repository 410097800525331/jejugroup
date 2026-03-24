const cmsConfig = {
  defaultTab: 'notices',
  tabs: {
    notices: {
      searchPlaceholder: '공지 제목 또는 코드 검색',
      primaryAction: '공지 등록',
      secondaryAction: '정렬',
      emptyMessage: '공지 데이터가 없습니다.',
      columns: ['공지 ID', '카테고리', '유형', '제목', '게시/예약일', '노출 상태', '관리'],
      rows: []
    },
    faqs: {
      searchPlaceholder: 'FAQ 질문 또는 코드 검색',
      primaryAction: 'FAQ 등록',
      secondaryAction: '정렬',
      emptyMessage: 'FAQ 데이터가 없습니다.',
      columns: ['FAQ ID', '카테고리', '질문 유형', '질문', '등록일', '노출 상태', '관리'],
      rows: []
    },
    banner: {
      searchPlaceholder: '배너 제목, 위치 검색',
      primaryAction: '위치/노출 설정',
      secondaryAction: '정렬',
      emptyMessage: '배너 데이터가 없습니다.',
      columns: ['배너 ID', '채널/영역', '위치/우선순위', '노출 규칙 / 조건', '제목', '노출 기간', '노출 상태', '관리'],
      rows: []
    }
  }
};

cmsConfig.notices = cmsConfig.tabs.notices;
cmsConfig.faqs = cmsConfig.tabs.faqs;
cmsConfig.banner = cmsConfig.tabs.banner;

export default cmsConfig;
