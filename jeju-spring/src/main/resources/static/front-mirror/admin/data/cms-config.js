const cmsConfig = {
  defaultTab: 'notices',
  searchButtonLabel: '검색',
  statusOptions: [
    { value: 'all', label: '전체' },
    { value: 'active', label: '노출 중' },
    { value: 'draft', label: '임시저장' },
    { value: 'inactive', label: '비노출' }
  ],
  tabs: {
    notices: {
      searchPlaceholder: '공지 제목이나 ID로 검색',
      primaryAction: '공지 등록',
      secondaryAction: null,
      pageSize: 8,
      typeFilterOptions: [
        { value: 'all', label: '전체' },
        { value: 'notice', label: '공지사항' },
        { value: 'event', label: '이벤트' }
      ],
      emptyMessage: '공지사항 데이터가 없습니다.',
      columns: ['공지 ID', '도메인', '유형', '제목', '게시 / 예약일', '노출 상태', '관리'],
      rows: []
    },
    faqs: {
      searchPlaceholder: 'FAQ 질문이나 ID로 검색',
      primaryAction: 'FAQ 등록',
      secondaryAction: '정렬',
      emptyMessage: 'FAQ 데이터가 없습니다.',
      columns: ['FAQ ID', '도메인', '질문 유형', '질문', '등록일', '노출 상태', '관리'],
      rows: []
    },
    banner: {
      searchPlaceholder: '배너 제목이나 슬롯으로 검색',
      primaryAction: '배너 등록',
      secondaryAction: '배치 정리',
      emptyMessage: '배너 데이터가 없습니다.',
      columns: ['배너 ID', '사이트 / 위치', '배치 / 형태', '노출 규칙 / 조건', '제목', '노출 기간', '노출 상태', '관리'],
      rows: []
    }
  }
};

export default cmsConfig;
