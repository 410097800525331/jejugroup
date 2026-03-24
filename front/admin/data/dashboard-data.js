const dashboardData = {
  defaultDomain: 'all',
  domainFilters: [
    { key: 'all', label: '전체(종합)' },
    { key: 'air', label: 'AIR' },
    { key: 'stay', label: 'STAY' },
    { key: 'rent', label: 'RENT' }
  ],
  chartRanges: [
    { range: 'hour', label: '시간' },
    { range: 'day', label: '일' },
    { range: 'week', label: '주' },
    { range: 'month', label: '월' },
    { range: 'halfYear', label: '반기' },
    { range: '1year', label: '1년' },
    { range: '2year', label: '2년' },
    { range: '5year', label: '5년' }
  ],
  kpi: {
    icons: {
      todayReservations: '📝',
      revenue: '💰',
      cancelRate: '📉',
      activeUsers: '🟢'
    },
    labels: {
      todayReservations: '오늘의 예약',
      revenue: '금일 매출',
      cancelRate: '취소율',
      activeUsers: '현재 접속자'
    },
    trendText: {
      up: '전일 대비 1.2%',
      down: '전일 대비 1.2%'
    }
  },
  chartCopy: {
    noDataLabel: '데이터 없음',
    revenueLabel: '매출액 (단위: 만원)',
    reservationLabel: '예약 건수 (건)'
  }
};

dashboardData.kpiLabels = dashboardData.kpi.labels;
dashboardData.chartLabels = {
  hour: [],
  day: [],
  week: [],
  month: [],
  halfYear: [],
  '1year': [],
  '2year': [],
  '5year': []
};
dashboardData.chartSeriesLabels = {
  revenue: dashboardData.chartCopy.revenueLabel,
  reservation: dashboardData.chartCopy.reservationLabel,
  noData: dashboardData.chartCopy.noDataLabel
};

export default dashboardData;
