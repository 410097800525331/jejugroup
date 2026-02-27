/**
 * JEJU GROUP Global Component Loader
 * Handles dynamic injection of Header and Footer with absolute path resolution.
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
      if (src && src.includes('components/layout/component_loader.js')) {
        return new URL('../../', src).href;
      }
    }

    return new URL('./', document.baseURI).href;
  })();

  const safeNavigate = (targetUrl) => {
    if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, 'component-loader');
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
  } catch (e) {
    console.warn('Router Binder failed to load:', e);
    document.body.addEventListener('click', async (e) => {
      const el = e.target.closest('[data-route]');
      if (el) {
        console.warn('[Fallback] Router Binder is off. Attempting fallback navigation.');
        e.preventDefault();
        try {
          await redirectByRoute(el);
        } catch (error) {
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

  const mainHeaderPlaceholder = document.getElementById('main-header-placeholder');
  if (mainHeaderPlaceholder) {
    const headerPath = resolveFromRoot('components/layout/header/main_header.html');
    loadComponent('main-header-placeholder', headerPath, appRoot, () => {
      console.log('Main Header loaded');
      document.dispatchEvent(new Event('mainHeaderLoaded'));
    });
  }

  const mainFooterPlaceholder = document.getElementById('main-footer-placeholder');
  if (mainFooterPlaceholder) {
    const footerPath = resolveFromRoot('components/layout/footer/main_footer.html');
    loadComponent('main-footer-placeholder', footerPath, appRoot, () => {
      console.log('Main Footer loaded');
      document.dispatchEvent(new Event('mainFooterLoaded'));
    });
  }
});
