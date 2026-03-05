const APP_ROOT_URL = new URL('../../', import.meta.url);
const APP_BOOTSTRAP_STATE_KEY = '__JEJU_ROUTE_NAVIGATOR__';
const NAVIGATE_LOCK_TTL_MS = 1200;

const normalizeTarget = (target, fallback = '') => {
  if (!target || typeof target !== 'string') {
    return '';
  }

  try {
    return new URL(target, window.location.href).href;
  } catch (error) {
    console.warn('[JEJU Bootstrap] Invalid route target ignored:', target, error);
    return fallback;
  }
};

const isSameLocation = (targetUrl) => {
  if (!targetUrl) {
    return false;
  }

  try {
    const current = new URL(window.location.href);
    const target = new URL(targetUrl);
    return (
      current.pathname === target.pathname &&
      current.search === target.search &&
      current.hash === target.hash
    );
  } catch (error) {
    return false;
  }
};

const releaseNavigateLock = () => {
  window.__JEJU_ROUTE_NAV_LOCK = null;
};

const safeNavigate = (targetUrl, reason = 'bootstrap', options = {}) => {
  const target = normalizeTarget(targetUrl);
  if (!target) {
    console.warn('[JEJU Bootstrap] Navigation blocked: target could not be resolved.', {
      reason
    });
    return;
  }

  if (isSameLocation(target)) {
    console.warn('[JEJU Bootstrap] Navigation blocked to prevent loop:', {
      reason,
      target
    });
    return;
  }

  if (window.__JEJU_ROUTE_NAV_LOCK === target) {
    console.warn('[JEJU Bootstrap] Navigation blocked by loop guard:', {
      reason,
      target
    });
    return;
  }

  window.__JEJU_ROUTE_NAV_LOCK = target;
  setTimeout(releaseNavigateLock, NAVIGATE_LOCK_TTL_MS);

  if (options?.mode === 'replace') {
    window.location.replace(target);
    return;
  }

  window.location.assign(target);
};

const hasBootstrap = () => {
  if (window.__JEJU_BOOTSTRAP_INITIALIZED__) {
    return true;
  }

  window.__JEJU_BOOTSTRAP_INITIALIZED__ = true;
  return false;
};

const initRouterBinderFallback = async () => {
  if (!window.__JEJU_ROUTE_NAVIGATOR__) {
    return;
  }

  try {
    const binderPath = new URL('core/utils/router_binder.js', APP_ROOT_URL).href;
    const binderModule = await import(binderPath);
    binderModule.initRouterBinder();
    return;
  } catch (error) {
    console.warn('[JEJU Bootstrap] Failed to initialize router_binder directly:', error);
  }
};

const ensureLegacyLoader = (relativeOrAbsolutePath, loaderName) => {
  const existing = Array.from(document.querySelectorAll('script')).some((script) =>
    script.src && script.src.includes(loaderName)
  );
  if (existing) {
    return Promise.resolve();
  }

  const src = normalizeTarget(relativeOrAbsolutePath);
  if (!src) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('data-jeju-bootstrap', 'legacy-loader');
    script.src = src;
    script.onload = resolve;
    script.onerror = (error) => {
      reject(error);
    };
    document.body.appendChild(script);
  });
};

window[APP_BOOTSTRAP_STATE_KEY] = {
  homeUrl: new URL('index.html', APP_ROOT_URL).href,
  safeNavigate,
  appRoot: APP_ROOT_URL.href
};

const detectAndBootstrap = async () => {

  const hasMainPlaceholder = Boolean(document.getElementById('main-header-placeholder'));
  const hasHotelPlaceholder = Boolean(document.getElementById('hotel-header-placeholder'));

  if (hasMainPlaceholder) {
    await ensureLegacyLoader(`${APP_ROOT_URL}components/layout/component_loader.js`, 'component_loader.js');
  }

  if (hasHotelPlaceholder) {
    await ensureLegacyLoader(
      `${APP_ROOT_URL}components/layout/hotel_component_loader.js`,
      'hotel_component_loader.js'
    );
  }
};

if (!hasBootstrap()) {
  window.__JEJU_BOOTSTRAP = window.__JEJU_BOOTSTRAP || {};
  window.__JEJU_BOOTSTRAP.initializedAt = new Date().toISOString();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      detectAndBootstrap().catch(() => {
        console.warn('[JEJU Bootstrap] detectAndBootstrap failed');
      });
      initRouterBinderFallback().catch(() => {});
    });
  } else {
    detectAndBootstrap().catch(() => {
      console.warn('[JEJU Bootstrap] detectAndBootstrap failed');
    });
    initRouterBinderFallback().catch(() => {});
  }
}
