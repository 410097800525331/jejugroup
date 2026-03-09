export const createLoadingMarkup = () => `
  <div class="meta-dashboard-layout skeleton-loader" style="pointer-events: none;">
    <section class="meta-section layer-hero bento-grid">
      <div class="bento-box hero-glass-container soft-radius pulse-bg" style="height: 200px; background: var(--meta-surface-glass);"></div>
      <div class="bento-box wallet-box meta-glass-theme soft-radius pulse-bg" style="height: 200px; background: var(--meta-surface-glass);"></div>
    </section>
  </div>
`;

export const createErrorMarkup = () => `
  <div class="meta-error-state">
    <div class="meta-error-box">
      <h2 class="error-title">CONNECTION INTERRUPTED</h2>
      <p class="error-desc">통합 데이터를 불러오는데 실패했습니다. 네트워크를 확인해주세요.</p>
      <button class="meta-btn-retry" id="btn-retry-meta" type="button">재시도</button>
    </div>
  </div>
`;

// --- Helpers ---
const renderFullWidthTripItem = (trip) => `
  <li class="inline-trip-card soft-radius" data-type="${trip.type}">
    <div class="trip-core-info">
      <div class="trip-head-flex">
        <span class="trip-status pill-shape type-${trip.type}">${trip.status}</span>
        <div class="trip-tags">
          ${trip.tags.map(tag => `<span class="meta-tag pill-shape">${tag}</span>`).join('')}
        </div>
      </div>
      <h3 class="trip-title">${trip.title}</h3>
      <div class="trip-meta-grid">
        <div class="meta-item"><i data-lucide="calendar"></i> <span>${trip.date}</span></div>
        <div class="meta-item"><i data-lucide="users"></i> <span>${trip.passengers || '정보 없음'}</span></div>
        <div class="meta-item"><i data-lucide="credit-card"></i> <strong>${trip.amount || '결제 완료'}</strong></div>
      </div>
    </div>
    
    <div class="trip-inline-actions">
      <div class="action-group">
        <button class="inline-btn outline pill-shape" onclick="location.href='${trip.actions.receipt}'"><i data-lucide="receipt"></i> 영수증/내역</button>
        <button class="inline-btn outline pill-shape" onclick="location.href='${trip.actions.modify}'"><i data-lucide="calendar-clock"></i> 일정 변경</button>
      </div>
      <button class="inline-btn danger pill-shape" onclick="location.href='${trip.actions.cancel}'"><i data-lucide="x-circle"></i> 예약 취소</button>
    </div>
  </li>
`;

// --- (Review, Favorite, Support renders remain unchanged) ---

const renderReviewItem = (rev) => `
  <div class="review-item">
    <div class="rev-stars">${Array(rev.rating).fill('<i data-lucide="star" class="fill"></i>').join('')}</div>
    <strong class="rev-title">${rev.title}</strong>
    <span class="rev-date">${rev.date}</span>
  </div>
`;

const renderFavoriteItem = (fav) => `
  <div class="fav-item" data-type="${fav.type}">
    <div class="fav-icon"><i data-lucide="${fav.type === 'air' ? 'plane' : 'hotel'}"></i></div>
    <div class="fav-info">
      <strong>${fav.title}</strong>
      <span>${fav.price}</span>
    </div>
  </div>
`;

const renderSupportItem = (sp) => `
  <a href="#" class="support-item bento-item">
    <div class="sp-icon"><i data-lucide="${sp.icon}"></i></div>
    <div class="sp-text">
      <strong>${sp.title}</strong>
      ${sp.count !== null ? `<span class="sp-badge">${sp.count}</span>` : ''}
    </div>
    <i data-lucide="chevron-right" class="sp-arrow"></i>
  </a>
`;

// --- Main Builder ---
export const createDashboardMarkup = (data) => {
  return `
    <main class="meta-dashboard-layout">
      
      <!-- LAYER 1: HERO & WALLET (Identity & Asset) -->
      <section class="meta-section layer-hero bento-grid">
        
        <!-- Profile / Identity & Quick Actions -->
        <div class="bento-box hero-glass-container profile-box soft-radius">
          <div class="profile-avatar-wrap">
            <img src="${data.profile.avatarUrl}" alt="profile" class="profile-avatar" />
            <div class="tier-badge pill-shape" style="background: ${data.profile.memberColor}">${data.profile.tier}</div>
          </div>
          <div class="profile-core-wrap">
            <div class="profile-info">
              <h1 class="profile-name"><strong class="highlight">${data.profile.name}</strong>님.</h1>
              <p class="profile-email">${data.profile.email}</p>
              
              <div class="membership-list">
                ${data.memberships.map(m => `<div class="mem-badge soft-radius"><span>${m.name}</span><strong>${m.number}</strong></div>`).join('')}
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions-bar">
              ${data.quickActions.map(action => `
                <a href="${action.route}" class="quick-btn pill-shape" data-action="${action.id}">
                  <div class="quick-icon"><i data-lucide="${action.icon}"></i></div>
                  <span>${action.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Wallet / Asset Summary -->
        <div class="bento-box wallet-box meta-glass-theme soft-radius">
          <div class="wallet-head">
            <span class="eyebrow">My Wallet</span>
            <h3>내 포인트</h3>
          </div>
          <div class="wallet-body">
            <div class="asset-main">
              <span class="val">${data.assets.points.toLocaleString()}</span> <span class="unit">P</span>
              <p class="expiring pill-shape">소멸 예정 ${data.assets.expiringPoints.toLocaleString()}P</p>
            </div>
            <div class="asset-grid">
              <div class="asset-sub">
                <span>트래블페이</span>
                <strong>${data.assets.travelCash.toLocaleString()}원</strong>
              </div>
              <div class="asset-sub">
                <span>보유 쿠폰</span>
                <strong>${data.assets.coupons}장</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LAYER 2: UNIFIED FULL-WIDTH MANAGEMENT (Grouped by Service) -->
      <section class="meta-section layer-full-management">
        <header class="section-header flex-header">
          <div>
            <h2 class="section-title">내 예약 관리</h2>
            <p class="section-subtitle">페이지 이동 없이 여기서 모든 일정을 통제하고 결제 내역을 확인하세요.</p>
          </div>
          <button class="txt-btn">지난 예약 보기 <i data-lucide="chevron-right"></i></button>
        </header>
        
        <div class="management-categorized-wrap">
          
          <!-- AIR RESERVATIONS -->
          <div class="service-category-block">
            <h3 class="category-title brand-air"><i data-lucide="plane"></i> 항공 예약 내역</h3>
            <ul class="full-width-trip-list">
              ${data.upcomingTrips.filter(t => t.type === 'air').length 
                ? data.upcomingTrips.filter(t => t.type === 'air').map(renderFullWidthTripItem).join('') 
                : '<li class="empty-state soft-radius">예약된 항공편이 없습니다.</li>'}
            </ul>
          </div>

          <!-- STAY RESERVATIONS -->
          <div class="service-category-block">
            <h3 class="category-title brand-stay"><i data-lucide="hotel"></i> 숙박 예약 내역</h3>
            <ul class="full-width-trip-list">
              ${data.upcomingTrips.filter(t => t.type === 'stay').length 
                ? data.upcomingTrips.filter(t => t.type === 'stay').map(renderFullWidthTripItem).join('') 
                : '<li class="empty-state soft-radius">예약된 숙소가 없습니다.</li>'}
            </ul>
          </div>

          <!-- RENTCAR RESERVATIONS -->
          <div class="service-category-block">
            <h3 class="category-title brand-rent"><i data-lucide="car"></i> 차량 예약 내역</h3>
            <ul class="full-width-trip-list">
              ${data.upcomingTrips.filter(t => t.type === 'rent').length 
                ? data.upcomingTrips.filter(t => t.type === 'rent').map(renderFullWidthTripItem).join('') 
                : '<li class="empty-state soft-radius">예약된 렌터카가 없습니다.</li>'}
            </ul>
          </div>

        </div>
      </section>

      <!-- LAYER 4: ENGAGEMENT (Reviews, Favs, Prefs) -->
      <section class="meta-section layer-engagement">
        <header class="section-header">
          <h2 class="section-title">내 활동 및 설정</h2>
        </header>
        <div class="bento-grid engagement-grid">
          
          <div class="bento-box review-box soft-radius">
            <div class="box-head"><h3>나의 이용 후기</h3></div>
            <div class="review-list">
              ${data.reviews.map(renderReviewItem).join('')}
            </div>
            <button class="full-cta-btn pill-shape">리뷰 모아보기</button>
          </div>

          <div class="bento-box fav-box soft-radius">
            <div class="box-head"><h3>즐겨찾기</h3></div>
            <div class="fav-list">
              ${data.favorites.map(renderFavoriteItem).join('')}
            </div>
          </div>

          <div class="bento-box pref-box soft-radius">
            <div class="box-head"><h3>여행 취향</h3></div>
            <ul class="pref-list">
              ${data.preferences.map(pref => `
                <li><span class="pref-lbl">${pref.label}</span><strong class="pref-val pill-shape">${pref.value}</strong></li>
              `).join('')}
            </ul>
          </div>
          
        </div>
      </section>

      <!-- LAYER 5: SUPPORT -->
      <section class="meta-section layer-support">
        <header class="section-header">
          <h2 class="section-title">고객 지원</h2>
        </header>
        <div class="bento-grid support-grid">
          ${data.support.map(renderSupportItem).join('')}
        </div>
      </section>

    </main>
  `;
};
