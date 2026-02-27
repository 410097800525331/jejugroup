/**
 * dashboard_loader.js
 * 마이페이지 공통 대시보드를 타겟 DOM(div#mypage-dashboard-root)에 마운팅 해주는 진입점.
 * 각 계열사 서비스에서 이 스크립트 하나만 호출하면 마이페이지가 자동으로 그려짐.
 */

import { globalDashboardStore } from '../../store/user_dashboard.js';
import { createProfileCard } from './widgets/profile_card.js';
import { createJourneyTimeline } from './widgets/journey_timeline.js';

class DashboardLoader {
  constructor(rootElementId) {
    this.rootId = rootElementId;
    this.rootEl = document.getElementById(this.rootId);
    this.unsubscribe = null;
  }

  mount() {
    if (!this.rootEl) {
      console.error(`[DashboardLoader] Target Element #${this.rootId} not found.`);
      return;
    }

    // 스타일시트 동적 주입 (중복 방지)
    if (!document.querySelector('link[href*="core/styles/mypage.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // 상대경로 고려
      const isJejuAir = window.location.pathname.includes('/jejuair/');
      link.href = isJejuAir ? '../../core/styles/mypage.css' : '../core/styles/mypage.css';
      document.head.appendChild(link);
    }
    
    // 폰트어썸 로드 확인
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fa = document.createElement('link');
      fa.rel = 'stylesheet';
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(fa);
    }

    // 스토어 구독 등록
    this.unsubscribe = globalDashboardStore.subscribe(this.render.bind(this));
    
    // 데이터 페칭 트리거
    globalDashboardStore.fetchDashboardData();
  }

  unmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.rootEl) {
      this.rootEl.innerHTML = '';
    }
  }

  render(data, isLoading, error) {
    if (!this.rootEl) return;

    // 헤더/푸터 간섭 회피용 CSS Variable 동적 계산 및 주입
    // 계열사별로 헤더/푸터 높이가 다를 수 있으므로 런타임에 계산
    const header = document.querySelector('header') || document.querySelector('.header');
    const footer = document.querySelector('footer');
    
    let headerOffset = 80; // Default
    if (header) headerOffset = header.offsetHeight;
    
    this.rootEl.style.setProperty('--header-offset', `${headerOffset}px`);

    // UI 렌더링
    if (isLoading) {
      this.rootEl.innerHTML = `
        <div class="mypage-container mypage-loading">
          <i class="fa-solid fa-circle-notch fa-spin fa-2x"></i>
          <p style="margin-top:16px;">여행 정보를 불러오고 있습니다...</p>
        </div>
      `;
      return;
    }

    if (error) {
      this.rootEl.innerHTML = `
        <div class="mypage-container mypage-error">
          <i class="fa-solid fa-triangle-exclamation fa-2x"></i>
          <p style="margin-top:16px;">${error}</p>
          <button onclick="window.location.reload()" style="margin-top:16px; padding:8px 16px; border-radius:4px; border:1px solid #ccc; background:#fff; cursor:pointer;">다시 시도</button>
        </div>
      `;
      return;
    }

    if (!data || !data.user) {
      this.rootEl.innerHTML = `
        <div class="mypage-container mypage-error">
          <p>사용자 세션이 만료되었거나 정보를 찾을 수 없습니다.</p>
        </div>
      `;
      return;
    }

    // 조립
    const profileHtml = createProfileCard(data.user);
    const timelineHtml = createJourneyTimeline(data.journeys);

    this.rootEl.innerHTML = `
      <div class="mypage-container">
        ${profileHtml}
        ${timelineHtml}
      </div>
    `;
  }
}

// 자동 마운팅 환경
document.addEventListener('DOMContentLoaded', () => {
  const dsLoader = new DashboardLoader('mypage-dashboard-root');
  dsLoader.mount();
});
