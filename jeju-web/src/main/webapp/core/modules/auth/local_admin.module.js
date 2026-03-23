/**
 * 로컬 관리자 접근 규칙과 관리자 권한 세션 판별 모듈
 */

const LOCAL_ADMIN_SOURCE = "LOCAL_FRONT_ADMIN";
const SESSION_STORAGE_KEY = "userSession";
const ADMIN_ROLE_KEYWORD = "ADMIN";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);
const PRIVATE_IPV4_PATTERN =
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/;

const isPrivateNetworkHost = (hostname) => {
  if (typeof hostname !== "string") {
    return false;
  }

  const normalizedHost = hostname.trim().toLowerCase();
  if (!normalizedHost) {
    return false;
  }

  return (
    LOCAL_HOSTS.has(normalizedHost) ||
    PRIVATE_IPV4_PATTERN.test(normalizedHost) ||
    normalizedHost.endsWith(".local") ||
    (!normalizedHost.includes(".") && !normalizedHost.includes(":"))
  );
};

const safeParseSession = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? { ...parsed } : null;
  } catch (_error) {
    return null;
  }
};

const toRoleList = (sessionData) => {
  if (!sessionData || typeof sessionData !== "object") {
    return [];
  }

  const roles = [];

  if (typeof sessionData.role === "string" && sessionData.role.trim() !== "") {
    roles.push(sessionData.role.trim());
  }

  if (Array.isArray(sessionData.roles)) {
    sessionData.roles.forEach((role) => {
      if (typeof role === "string" && role.trim() !== "") {
        roles.push(role.trim());
      }
    });
  }

  return roles;
};

export const isLocalFrontEnvironment = () => {
  return window.location.protocol === "file:" || isPrivateNetworkHost(window.location.hostname);
};

export const buildLocalFrontAdminSession = () => {
  return Object.freeze({
    id: "local-admin",
    name: "로컬 관리자",
    email: "admin@local.jejugroup",
    role: "ADMIN",
    roles: ["ADMIN", "SUPER_ADMIN"],
    authSource: LOCAL_ADMIN_SOURCE,
    isLocalAdmin: true,
  });
};

export const hasAdminAccess = (sessionData) => {
  return toRoleList(sessionData).some((role) => role.toUpperCase().includes(ADMIN_ROLE_KEYWORD));
};

export const getStoredAdminSession = () => {
  try {
    const sessionData = safeParseSession(window.localStorage.getItem(SESSION_STORAGE_KEY));
    return hasAdminAccess(sessionData) ? Object.freeze({ ...sessionData }) : null;
  } catch (_error) {
    return null;
  }
};

export const getStoredSession = () => {
  try {
    const sessionData = safeParseSession(window.localStorage.getItem(SESSION_STORAGE_KEY));
    return sessionData ? Object.freeze({ ...sessionData }) : null;
  } catch (_error) {
    return null;
  }
};

export const resolveAdminSession = () => {
  const storedAdminSession = getStoredAdminSession();
  if (storedAdminSession) {
    return storedAdminSession;
  }

  // 일반 유저 세션이 이미 있으면 로컬 관리자 fallback을 덮어씌우지 않는다.
  if (getStoredSession()) {
    return null;
  }

  if (isLocalFrontEnvironment()) {
    return buildLocalFrontAdminSession();
  }

  return null;
};

export const canUseAdminSurface = () => {
  return Boolean(resolveAdminSession());
};
