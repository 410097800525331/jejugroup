import { ROUTES } from '../constants/routes.js';

const TOKEN_PATTERN = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g;
const APP_BASE_URL = new URL('../../', import.meta.url);
const EXTERNAL_URL_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

const getNestedValue = (object, keyPath) => {
  return keyPath.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key];
    }
    return undefined;
  }, object);
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

const toAbsolutePath = (pathLike) => {
  if (EXTERNAL_URL_PATTERN.test(pathLike)) {
    return pathLike;
  }

  const normalizedPath = pathLike.startsWith('/') ? pathLike.slice(1) : pathLike;
  return new URL(normalizedPath, APP_BASE_URL).href;
};

/**
 * Resolve route key to runtime URL path.
 *
 * @param {string} routeKey - e.g. 'AUTH.LOGIN'
 * @param {Object} [params={}] - path variables and/or query params
 * @returns {string}
 */
export const resolveRoute = (routeKey, params = {}) => {
  if (typeof routeKey !== 'string' || routeKey.trim() === '') {
    throw new TypeError('[RouteResolver] routeKey must be a non-empty string.');
  }

  if (params === null || typeof params !== 'object' || Array.isArray(params)) {
    throw new TypeError('[RouteResolver] params must be a plain object.');
  }

  const template = getNestedValue(ROUTES, routeKey.trim());
  if (typeof template !== 'string' || template.trim() === '') {
    throw new Error(`[RouteResolver] Route key not found: ${routeKey}`);
  }

  const consumedKeys = new Set();
  const resolvedPath = template.replace(TOKEN_PATTERN, (_, colonKey, braceKey) => {
    const tokenKey = colonKey || braceKey;
    const tokenValue = params[tokenKey];

    if (tokenValue === undefined || tokenValue === null) {
      throw new Error(`[RouteResolver] Missing route param: ${tokenKey} (${routeKey})`);
    }

    consumedKeys.add(tokenKey);
    return encodeURIComponent(String(tokenValue));
  });

  const absolutePath = toAbsolutePath(resolvedPath);
  return appendQueryString(absolutePath, params, consumedKeys);
};
