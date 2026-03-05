/**
 * widgets/ai_curation.js
 * 컨텍스트 인식 기반 AI 자동 추천 위젯
 */

export const createAiCuration = (journeys) => {
  const upcoming = journeys?.find(j => j.status === 'UPCOMING');
  if (!upcoming) return '';

  // 컨텍스트 분석: 비행기는 있는데 렌터카가 없는 경우 등
  let msg = '';
  let btnText = '';

  if (upcoming.air && !upcoming.car) {
    msg = '항공권과 숙박 예약이 완료되었습니다. 전기차 렌트 시 <strong class="color-orange">5% 추가 할인</strong> 및 친환경 배지를 드립니다.';
    btnText = '렌터카 추가하기';
  } else if (upcoming.air && upcoming.car && !upcoming.stay) {
    msg = '항공과 차량 준비 완료! 취향에 맞는 <strong class="color-orange">제주스테이 시그니처 룸</strong>을 AI가 추천합니다.';
    btnText = '숙소 추천받기';
  } else {
    msg = '모든 여정이 완벽하게 준비되었습니다. 여행지 근처 <strong class="color-orange">숨은 맛집</strong>을 확인해보세요.';
    btnText = 'AI 맛집 지도';
  }

  return `
    <div class="ai-curation-widget">
      <div class="ai-icon-box">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
      </div>
      <div class="ai-content">
        <h4 class="ai-title">AI 맞춤 큐레이션</h4>
        <p class="ai-desc">${msg}</p>
      </div>
      <button class="ai-action-btn">${btnText}</button>
    </div>
  `;
};
