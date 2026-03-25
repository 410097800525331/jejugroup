import { ROUTE_METADATA } from '../constants/routes.js';

const TOKEN_PATTERN = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g;
const EXTERNAL_URL_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const SHELL_QUERY_KEY = 'shell';
const SHELL_STORAGE_KEY = 'jeju:mypage-shell';
const SHELL_VALUES = new Set(['main', 'stay', 'air']);

const getNestedValue = (object, keyPath) => {
  return keyPath.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key];
    }
    return undefined;
  }, object);
};

const buildLegacyRouteString = (routeMeta) => {
  if (!routeMeta || typeof routeMeta !== 'object') {
    return '';
  }

  if (routeMeta.kind === 'external') {
    return routeMeta.url;
  }

  const queryString = routeMeta.defaultQuery
    ? `?${new URLSearchParams(routeMeta.defaultQuery).toString()}`
    : '';
  const hash = routeMeta.hash ?? '';

  return `${routeMeta.path}${queryString}${hash}`;
};

const appendQueryString = (url, params, consumedKeys) => {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (consumedKeys.has(key) || value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          query.append(key, String(item));
        }
      });
      continue;
    }

    query.append(key, String(value));
  }

  const queryString = query.toString();
  if (!queryString) {
    return url;
  }

  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
};

const resolveAppBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const appRoot = window.__JEJU_ROUTE_NAVIGATOR__?.appRoot;
    if (typeof appRoot === 'string' && appRoot.trim() !== '') {
      try {
        return new URL(appRoot, window.location.href);
      } catch (error) {
        // no-op
      }
    }
  }

  return new URL(/* @vite-ignore */ '../../', import.meta.url);
};

const resolveSiteOriginUrl = () => {
  if (typeof window !== 'undefined' && typeof window.location?.origin === 'string') {
    return new URL(window.location.origin);
  }

  return new URL('/', import.meta.url);
};

const toAbsolutePath = (pathLike) => {
  if (EXTERNAL_URL_PATTERN.test(pathLike)) {
    return pathLike;
  }

  if (pathLike.startsWith('/')) {
    return new URL(pathLike, resolveSiteOriginUrl()).href;
  }

  return new URL(pathLike, resolveAppBaseUrl()).href;
};

const normalizeShell = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return SHELL_VALUES.has(normalized) ? normalized : null;
};

const resolveShellFromPathname = (pathname = '') => {
  const normalizedPathname = String(pathname).toLowerCase();
  if (normalizedPathname.includes('/jejuair/')) {
    return 'air';
  }

  if (normalizedPathname.includes('/jejustay/')) {
    return 'stay';
  }

  return 'main';
};

const resolveCurrentShell = () => {
  if (typeof window === 'undefined') {
    return 'main';
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const queryShell = normalizeShell(searchParams.get(SHELL_QUERY_KEY));
    if (queryShell) {
      return queryShell;
    }
  } catch (error) {
    // no-op
  }

  if (typeof document !== 'undefined') {
    const datasetShell = normalizeShell(document.body?.dataset?.mypageShell);
    if (datasetShell) {
      return datasetShell;
    }
  }

  const pathnameShell = resolveShellFromPathname(window.location.pathname);
  if (pathnameShell) {
    return pathnameShell;
  }

  try {
    const storedShell = normalizeShell(window.sessionStorage?.getItem(SHELL_STORAGE_KEY));
    if (storedShell) {
      return storedShell;
    }
  } catch (error) {
    // no-op
  }

  return 'main';
};

const injectRouteDefaults = (routeMeta, params) => {
  const withDefaultQuery = routeMeta.defaultQuery
    ? {
        ...routeMeta.defaultQuery,
        ...params,
      }
    : params;

  if (
    !routeMeta ||
    routeMeta.shellStrategy !== 'auth-shell' ||
    normalizeShell(withDefaultQuery?.[SHELL_QUERY_KEY])
  ) {
    return withDefaultQuery;
  }

  const currentShell = resolveCurrentShell();

  return {
    ...withDefaultQuery,
    [SHELL_QUERY_KEY]: currentShell
  };
};

export const resolveRoute = (routeKey, params = {}) => {
  if (typeof routeKey !== 'string' || routeKey.trim() === '') {
    throw new TypeError('[RouteResolver] routeKey must be a non-empty string.');
  }

  if (params === null || typeof params !== 'object' || Array.isArray(params)) {
    throw new TypeError('[RouteResolver] params must be a plain object.');
  }

  const normalizedRouteKey = routeKey.trim();
  const routeMeta = getNestedValue(ROUTE_METADATA, normalizedRouteKey);
  if (!routeMeta || typeof routeMeta !== 'object' || !routeMeta.kind) {
    throw new Error(`[RouteResolver] Route key not found: ${routeKey}`);
  }

  const template = buildLegacyRouteString(routeMeta);
  if (typeof template !== 'string' || template.trim() === '') {
    throw new Error(`[RouteResolver] Route template not found: ${routeKey}`);
  }

  const enrichedParams = injectRouteDefaults(routeMeta, params);
  const consumedKeys = new Set(routeMeta.defaultQuery ? Object.keys(routeMeta.defaultQuery) : []);
  const resolvedPath = template.replace(TOKEN_PATTERN, (_, colonKey, braceKey) => {
    const tokenKey = colonKey || braceKey;
    const tokenValue = enrichedParams[tokenKey];

    if (tokenValue === undefined || tokenValue === null) {
      throw new Error(`[RouteResolver] Missing route param: ${tokenKey} (${routeKey})`);
    }

    consumedKeys.add(tokenKey);
    return encodeURIComponent(String(tokenValue));
  });

  const hashIndex = resolvedPath.indexOf('#');
  const pathWithoutHash = hashIndex >= 0 ? resolvedPath.slice(0, hashIndex) : resolvedPath;
  const hash = hashIndex >= 0 ? resolvedPath.slice(hashIndex) : '';
  const absolutePath = `${toAbsolutePath(pathWithoutHash)}${hash}`;
  return appendQueryString(absolutePath, enrichedParams, consumedKeys);
};
