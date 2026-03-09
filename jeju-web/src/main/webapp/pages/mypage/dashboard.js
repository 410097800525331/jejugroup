import { getDashboardData } from './dashboard_data.js';
import { createDashboardMarkup, createErrorMarkup, createLoadingMarkup } from './dashboard_markup.js';
import { mountMyPageShell } from './dashboard_shell.js';

// ==========================================
// Meta-Design Controller
// ==========================================

const getRootElement = () => document.getElementById('mypage-dashboard-root');

// --- Observer logic for Scroll Reveal ---
const createRevealObserver = () => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
};

const attachRevealAnimations = (rootEl) => {
  const observer = createRevealObserver();
  const revealElements = rootEl.querySelectorAll('[data-reveal]');
  revealElements.forEach(el => observer.observe(el));
};

// --- DOM Rendering Pipeline ---
const renderToRoot = (markupString) => {
  const root = getRootElement();
  if (!root) return;
  
  root.innerHTML = markupString;
  
  // Lucide 아이콘 동적 마운트 (마크업이 주입된 직후에 실행되어야 함)
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
};

const bindRetryEvent = () => {
  const retryBtn = document.getElementById('btn-retry-meta');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      bootstrapMyPage();
    });
  }
};

// --- Main Execution Flow ---
export const bootstrapMyPage = async () => {
  const root = getRootElement();
  if (!root) return;

  try {
    await mountMyPageShell();
  } catch (error) {
    console.error('Shell mount failed', error);
  }

  // 1. 로딩 렌더
  renderToRoot(createLoadingMarkup());

  try {
    // 2. 통합 데이터 로드
    const data = await getDashboardData();
    
    // 3. 마크업 생성
    const finalMarkup = createDashboardMarkup(data);
    
    // 4. 루트 프레임 렌더 (Lucide 포함)
    renderToRoot(finalMarkup);

  } catch (error) {
    renderToRoot(createErrorMarkup());
    bindRetryEvent();
  }
};

// --- Event Binding ---
document.addEventListener('DOMContentLoaded', bootstrapMyPage);
