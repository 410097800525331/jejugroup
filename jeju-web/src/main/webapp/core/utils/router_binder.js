import { resolveRoute } from './path_resolver.js';

let isRouterBinderInitialized = false;

const CLICK_BYPASS_KEYS = ['ctrlKey', 'metaKey', 'shiftKey', 'altKey'];

const isBypassClick = (event) => CLICK_BYPASS_KEYS.some((key) => Boolean(event[key]));

const parseRouteParams = (element) => {
  const raw = element.getAttribute('data-route-params');
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    console.warn('[RouterBinder] Invalid data-route-params JSON:', raw);
    return {};
  }
};

const navigateToRoute = (element) => {
  const routeKey = element.getAttribute('data-route');
  if (!routeKey) {
    return;
  }

  try {
    const params = parseRouteParams(element);
    const targetUrl = resolveRoute(routeKey, params);
    const mode = element.getAttribute('data-route-mode') || 'assign';
    const safeNavigator = window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate;

    if (safeNavigator) {
      safeNavigator(targetUrl, 'router-binder', { mode });
      return;
    }

    if (mode === 'replace') {
      window.location.replace(targetUrl);
      return;
    }

    window.location.assign(targetUrl);
  } catch (error) {
    console.warn(`[RouterBinder] Failed to resolve route '${routeKey}':`, error);
  }
};

const hydrateRouteNode = (node) => {
  if (!(node instanceof Element)) {
    return;
  }

  const routeNodes = [];
  if (node.matches('[data-route]')) {
    routeNodes.push(node);
  }
  routeNodes.push(...node.querySelectorAll('[data-route]'));

  routeNodes.forEach((routeNode) => {
    if (!(routeNode instanceof HTMLAnchorElement)) {
      return;
    }

    const routeKey = routeNode.getAttribute('data-route');
    if (!routeKey) {
      return;
    }

    try {
      const params = parseRouteParams(routeNode);
      const href = resolveRoute(routeKey, params);
      routeNode.setAttribute('href', href);
    } catch (error) {
      routeNode.setAttribute('href', '#');
      console.warn(`[RouterBinder] Failed to hydrate href for '${routeKey}':`, error);
    }
  });
};

const observeDynamicRoutes = () => {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        hydrateRouteNode(node);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

export const syncRouteBindings = (root = document) => {
  if (root instanceof Document) {
    hydrateRouteNode(root.documentElement);
    return;
  }
  hydrateRouteNode(root);
};

export const initRouterBinder = () => {
  if (isRouterBinderInitialized) {
    return;
  }

  isRouterBinderInitialized = true;

  syncRouteBindings(document);
  observeDynamicRoutes();

  document.body.addEventListener('click', (event) => {
    const routeElement = event.target.closest('[data-route]');
    if (!routeElement) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    if (routeElement.hasAttribute('data-route-animated-nav')) {
      return;
    }

    if (isBypassClick(event)) {
      return;
    }

    if (
      routeElement instanceof HTMLAnchorElement &&
      routeElement.getAttribute('target') &&
      routeElement.getAttribute('target') !== '_self'
    ) {
      return;
    }

    event.preventDefault();
    navigateToRoute(routeElement);
  });
};
