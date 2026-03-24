const cmsConfig = {
  defaultTab: 'notices',
  tabs: {
    notices: {
      searchPlaceholder: '공지 제목 또는 서비스 검색',
      primaryAction: '공지 DB 보기',
      secondaryAction: '정렬',
      emptyMessage: '공지 데이터가 없습니다.',
      columns: ['공지 ID', '서비스', '유형', '제목', '게시 / 예약일', '노출 상태', '관리'],
      rows: []
    },
    faqs: {
      searchPlaceholder: 'FAQ 질문 또는 서비스 검색',
      primaryAction: 'FAQ DB 보기',
      secondaryAction: '정렬',
      emptyMessage: 'FAQ 데이터가 없습니다.',
      columns: ['FAQ ID', '서비스', '질문 유형', '질문', '등록일', '노출 상태', '관리'],
      rows: []
    },
    categories: {
      searchPlaceholder: '서비스 또는 카테고리 코드 검색',
      primaryAction: '분류 DB 보기',
      secondaryAction: '정렬',
      emptyMessage: '문의 카테고리 데이터가 없습니다.',
      columns: ['카테고리 ID', '서비스', '코드 / 정렬', '이름', '설명', '노출 상태', '관리'],
      rows: []
    }
  }
};

cmsConfig.notices = cmsConfig.tabs.notices;
cmsConfig.faqs = cmsConfig.tabs.faqs;
cmsConfig.categories = cmsConfig.tabs.categories;

export default cmsConfig;
