const dashboardData = {
  pageTitle: '종합 대시보드',
  chartTitle: '매출 및 예약 추이',
  reportButtonLabel: '보고서 다운로드',
  defaultDomain: 'all',
  domainFilters: [
    { key: 'all', label: '전체(종합)' },
    { key: 'flight', label: '제주에어' },
    { key: 'hotel', label: '제주 스테이' },
    { key: 'rentcar', label: '제주 렌트카' }
  ],
  chartRanges: [
    {
      range: 'hour',
      label: '시간',
      labels: Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`)
    },
    {
      range: 'day',
      label: '일',
      labels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D-0']
    },
    {
      range: 'week',
      label: '주',
      labels: ['1주차', '2주차', '3주차', '4주차', '5주차', '6주차', '7주차', '8주차']
    },
    {
      range: 'month',
      label: '월',
      labels: Array.from({ length: 12 }, (_, index) => `${index + 1}월`)
    },
    {
      range: 'halfYear',
      label: '반기',
      labels: ['상반기', '하반기', '최근 상반기', '최근 하반기']
    },
    {
      range: '1year',
      label: '1년',
      labels: Array.from({ length: 12 }, (_, index) => `${String(index + 1).padStart(2, '0')}월`)
    },
    {
      range: '2year',
      label: '2년',
      labels: ['24 Q1', '24 Q2', '24 Q3', '24 Q4', '25 Q1', '25 Q2', '25 Q3', '25 Q4']
    },
    {
      range: '5year',
      label: '5년',
      labels: ['2022', '2023', '2024', '2025', '2026']
    }
  ],
  kpi: {
    icons: {
      todayReservations: '📌',
      revenue: '💰',
      cancelRate: '↩',
      activeUsers: '👤'
    },
    labels: {
      todayReservations: '오늘 예약',
      revenue: '금일 매출',
      cancelRate: '취소율',
      activeUsers: '현재 접속'
    },
    trend: {
      todayReservations: {
        tone: 'positive',
        text: '전일 대비 0.0%'
      },
      revenue: {
        tone: 'positive',
        text: '전일 대비 0.0%'
      },
      cancelRate: {
        tone: 'negative',
        text: '전일 대비 0.0%'
      },
      activeUsers: {
        tone: 'positive',
        text: '전일 대비 0.0%'
      }
    }
  },
  chartCopy: {
    revenueLabel: '매출액(단위: 만원)',
    reservationLabel: '예약 건수',
    noDataLabel: '차트 데이터 없음',
    emptyStateTitle: '차트 데이터가 비어 있음',
    emptyStateMessage: 'DB 데이터가 들어오면 같은 렌더 경로로 차트가 채워집니다.'
  },
  recentActivity: {
    columns: ['유형', '내용', '발생 시각', '상태'],
    emptyTitle: '최근 활동 없음',
    emptyMessage: '아직 표시할 최근 활동이 없습니다.',
    badges: {
      reservation: { label: '예약', className: 'success' },
      cancel: { label: '취소', className: 'danger' },
      inquiry: { label: '문의', className: 'warning' },
      notice: { label: '공지', className: 'info' },
      default: { label: '이벤트', className: 'neutral' }
    },
    statusLabels: {
      success: '완료',
      danger: '실패',
      warning: '대기',
      info: '진행',
      neutral: '대기'
    }
  }
};

dashboardData.kpiLabels = dashboardData.kpi.labels;
dashboardData.chartLabels = Object.fromEntries(dashboardData.chartRanges.map(({ range, labels }) => [range, labels]));
dashboardData.chartSeriesLabels = {
  revenue: dashboardData.chartCopy.revenueLabel,
  reservation: dashboardData.chartCopy.reservationLabel,
  noData: dashboardData.chartCopy.noDataLabel
};

if (typeof window !== 'undefined') {
  window.AdminDashboardData = dashboardData;
}

export default dashboardData;
