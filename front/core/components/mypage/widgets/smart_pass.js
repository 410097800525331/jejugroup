/**
 * widgets/smart_pass.js
 * 제로 모놀리스 원칙에 기반한 디지털 월렛 (NFC 스마트 패스) 단일 위젯
 * 항공권, 렌터카 스마트키, 호텔 룸키를 하나의 패스로 통합 표현 (Jeju Orange 테마)
 */

export const createSmartPass = (journeys) => {
  // 간단한 유효 여정 검사 (Upcoming 기준)
  const upcoming = journeys?.find(j => j.status === 'UPCOMING');
  if (!upcoming) return '';

  return `
    <div class="smart-pass-widget">
      <div class="smart-pass-card">
        <div class="sp-glow"></div>
        <div class="sp-content">
          <div class="sp-icon-wrap">
            <i class="fa-solid fa-nfc-symbol"></i>
          </div>
          <h2 class="sp-title">통합 스마트 패스</h2>
          <p class="sp-desc">항공 탑승권, 호텔 룸키, 차량 스마트키가 하나로 연동되었습니다. 리더기에 탭하세요.</p>
          
          <div class="sp-barcode-container">
            <div class="sp-barcode"></div>
            <div class="sp-barcode-text">P-JEJU-${upcoming.id.split('-')[1] || '0000'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};
