/**
 * widgets/journey_timeline.js
 * 예약 기반의 여행 타임라인(비행기 -> 호텔 -> 렌터카 등)을 시각적으로 렌더링하는 컴포넌트
 */

const getStatusBadge = (status) => {
  const isUpcoming = status === 'CONFIRMED' || status === 'UPCOMING';
  const label = isUpcoming ? '예약 확정' : '이용 완료';
  const className = isUpcoming ? 'status-upcoming' : 'status-completed';
  return `<span class="status-badge ${className}">${label}</span>`;
};

const renderTimelineNode = (item, type, icon) => {
  if (!item) return '';

  let mainHtml = '';
  let descHtml = '';

  if (type === 'air') {
    mainHtml = `${item.flight} (${item.provider})`;
    descHtml = `${item.departure} <i class="fa-solid fa-arrow-right mx-1"></i> ${item.arrival}`;
  } else if (type === 'car') {
    mainHtml = `${item.model} (${item.provider})`;
    descHtml = `픽업: ${item.pickup} / 반납: ${item.return}`;
  } else if (type === 'stay') {
    mainHtml = `${item.name} (${item.provider})`;
    descHtml = `체크인: ${item.checkIn} / 체크아웃: ${item.checkOut}`;
  }

  const isConfirmed = item.status === 'CONFIRMED';
  
  return `
    <div class="timeline-item ${isConfirmed ? 'active' : ''}">
      <div class="timeline-dot"><i class="fa-${isConfirmed ? 'solid' : 'regular'} ${icon}"></i></div>
      <div class="timeline-content">
        <div class="tl-header">
          <span class="tl-provider">${type.toUpperCase()}</span>
          <span class="tl-status">${isConfirmed ? '예약됨' : '완료됨'}</span>
        </div>
        <div class="tl-main">${mainHtml}</div>
        <div class="tl-desc">${descHtml}</div>
      </div>
    </div>
  `;
};

const createJourneyCard = (journey) => {
  return `
    <article class="journey-card">
      <div class="journey-header">
        <div>
          <h3>${journey.title}</h3>
          <div class="journey-date">${journey.date}</div>
        </div>
        <div>
          ${getStatusBadge(journey.status)}
        </div>
      </div>
      
      <div class="journey-body">
        <div class="timeline">
          ${renderTimelineNode(journey.air, 'air', 'fa-plane-departure')}
          ${renderTimelineNode(journey.car, 'car', 'fa-car-side')}
          ${renderTimelineNode(journey.stay, 'stay', 'fa-bed')}
        </div>
      </div>
    </article>
  `;
};

export const createJourneyTimeline = (journeys) => {
  if (!journeys || journeys.length === 0) {
    return `<div class="mypage-error">예약된 여정이 없습니다.</div>`;
  }

  const cardsHtml = journeys.map(createJourneyCard).join('');
  
  return `
    <div class="journey-section">
      <h2 class="journey-section-title">나의 여행 타임라인</h2>
      <div class="journey-list">
        ${cardsHtml}
      </div>
    </div>
  `;
};
