/**
 * widgets/point_dashboard.js
 * 제주그룹 통합 멤버십/포인트 진행도 렌더링 위젯
 */

export const createPointDashboard = (user) => {
  if (!user) return '';

  const POINTS_NEEDED_FOR_VIP = 50000;
  const currentPoints = user.miles || 0;
  let progressRatio = (currentPoints / POINTS_NEEDED_FOR_VIP) * 100;
  if (progressRatio > 100) progressRatio = 100;
  
  const remaining = POINTS_NEEDED_FOR_VIP - currentPoints;

  return `
    <div class="point-dashboard-widget">
      <div class="pd-header">
        <div class="pd-info">
          <span class="pd-label">통합 멤버십 등급</span>
          <div class="pd-points">
            <strong>${currentPoints.toLocaleString()}</strong> <span class="pd-unit">P</span>
          </div>
        </div>
        <div class="pd-target">
          <span class="pd-target-label">다음 등급 (VIP) 까지</span>
          <span class="pd-target-val">${remaining > 0 ? remaining.toLocaleString() : 0} P</span>
        </div>
      </div>
      
      <div class="pd-progress-track">
        <div class="pd-progress-fill" style="width: ${progressRatio}%;">
          <div class="pd-progress-glow"></div>
        </div>
      </div>
    </div>
  `;
};
