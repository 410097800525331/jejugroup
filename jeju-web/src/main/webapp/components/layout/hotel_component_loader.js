/**
 * JEJU STAY Component Loader
 * Handles dynamic injection of Header and Footer
 */

async function loadComponent(elementId, path, basePath, callback) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    let html = await response.text();

    html = html.replace(/\{BASE_PATH\}/g, basePath);

    const el = document.getElementById(elementId);
    if (el) {
      el.innerHTML = html;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error('Component loading error:', error);
  }
}

async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const parseRouteParams = (element) => {
    const raw = element.getAttribute('data-route-params');
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      return {};
    }
  };

  const appRoot = (() => {
    if (window.__JEJU_ROUTE_NAVIGATOR__?.appRoot) {
      return new URL(window.__JEJU_ROUTE_NAVIGATOR__.appRoot, window.location.href).href;
    }

    if (document.currentScript && document.currentScript.src) {
      return new URL('../../', document.currentScript.src).href;
    }

    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      const src = script.src || script.getAttribute('src');
      if (src && src.includes('components/layout/hotel_component_loader.js')) {
        return new URL('../../', src).href;
      }
    }

    return new URL('./', document.baseURI).href;
  })();

  const safeNavigate = (targetUrl) => {
    if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, 'hotel-component-loader');
      return;
    }

    if (targetUrl) {
      window.location.assign(targetUrl);
    }
  };

  const getDefaultIndexUrl = () => {
    if (window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl) {
      return window.__JEJU_ROUTE_NAVIGATOR__.homeUrl;
    }

    return new URL('index.html', appRoot).href;
  };

  const resolveFromRoot = (resourcePath) => new URL(resourcePath, appRoot).href;

  const redirectByRoute = async (el) => {
    const routeKey = el.getAttribute('data-route');
    if (!routeKey) {
      return;
    }

    try {
      const resolverPath = resolveFromRoot('core/utils/path_resolver.js');
      const resolverModule = await import(resolverPath);
      const targetUrl = resolverModule.resolveRoute(routeKey, parseRouteParams(el));
      safeNavigate(targetUrl);
    } catch (error) {
      console.warn('[Fallback] Route resolve failed. Navigating to index.html.', error);
      safeNavigate(getDefaultIndexUrl());
    }
  };

  try {
    const routerPath = resolveFromRoot('core/utils/router_binder.js');
    const routerModule = await import(routerPath);
    routerModule.initRouterBinder();
  } catch (error) {
    console.warn('Router Binder failed to load:', error);
    document.body.addEventListener('click', async (e) => {
      const el = e.target.closest('[data-route]');
      if (el) {
        console.warn('[Fallback] Router Binder is off. Attempting blind redirect to index.');
        e.preventDefault();
        try {
          await redirectByRoute(el);
        } catch (innerError) {
          safeNavigate(getDefaultIndexUrl());
        }
      }
    });
  }

  document.body.addEventListener('click', async (e) => {
    const actionEl = e.target.closest('[data-action="OPEN_RESERVATION_DRAWER"]');
    if (actionEl) {
      e.preventDefault();
      try {
        const drawerPath = resolveFromRoot('components/ui/reservation_drawer/drawer.js');
        const { reservationDrawer } = await import(drawerPath);
        reservationDrawer.open();
      } catch (error) {
        console.error('[Drawer] Failed to open reservation drawer:', error);
      }
    }
  });

  const headerPath = resolveFromRoot('components/layout/header/header.html');
  const footerPath = resolveFromRoot('components/layout/footer/footer.html');

  loadComponent('hotel-header-placeholder', headerPath, appRoot, async () => {
    console.log('Header loaded');
    document.dispatchEvent(new Event('mainHeaderLoaded'));

    try {
      await loadScript(resolveFromRoot('components/layout/header/header.js'));
      if (typeof initHeader === 'function') {
        initHeader();
      }
      if (typeof initStaggerNav === 'function') {
        initStaggerNav();
      }
    } catch (error) {
      console.error('Failed to load header script:', error);
    }
  });

  loadComponent('hotel-footer-placeholder', footerPath, appRoot, () => {
    console.log('Footer loaded');
    document.dispatchEvent(new Event('mainFooterLoaded'));

    if (typeof initFooter === 'function') {
      initFooter();
    }
  });
});
