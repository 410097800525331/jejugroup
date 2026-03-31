import { API_BASE_URL } from "../config/api_config.module.js";

const SESSION_STORAGE_KEY = "userSession";
const SESSION_EVENT_NAME = "jeju:session-updated";
const AUTH_SESSION_ENDPOINT = "/api/auth/session";
const AUTH_LOGOUT_ENDPOINT = "/api/auth/logout";
const SESSION_HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000;

let sessionHeartbeatTimerId = null;
let sessionHeartbeatRequestPromise = null;

const toApiUrl = (path) => `${API_BASE_URL}${path}`;

const parseSession = (rawValue) => {
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

const serializeSession = (session) => {
  if (!session || typeof session !== "object") {
    return null;
  }

  try {
    return JSON.stringify(session);
  } catch (_error) {
    return null;
  }
};

const emitSessionUpdate = (session) => {
  try {
    const detail = session ? { session: { ...session } } : { session: null };
    window.dispatchEvent(new CustomEvent(SESSION_EVENT_NAME, { detail }));
  } catch (error) {
    console.warn("[SessionManager] Session event dispatch failed:", error);
  }
};

const stopSessionHeartbeat = () => {
  if (sessionHeartbeatTimerId !== null) {
    window.clearInterval(sessionHeartbeatTimerId);
    sessionHeartbeatTimerId = null;
  }

  sessionHeartbeatRequestPromise = null;
};

const refreshSessionHeartbeat = async () => {
  if (sessionHeartbeatRequestPromise) {
    return sessionHeartbeatRequestPromise;
  }

  const storedSession = getStoredSession();
  if (!storedSession) {
    stopSessionHeartbeat();
    return null;
  }

  sessionHeartbeatRequestPromise = (async () => {
    try {
      return await fetchSessionFromServer();
    } catch (error) {
      console.warn("[SessionManager] Session heartbeat failed:", error);
      return null;
    } finally {
      sessionHeartbeatRequestPromise = null;
    }
  })();

  return sessionHeartbeatRequestPromise;
};

const ensureSessionHeartbeat = () => {
  if (sessionHeartbeatTimerId !== null) {
    return;
  }

  if (typeof window.setInterval !== "function") {
    return;
  }

  sessionHeartbeatTimerId = window.setInterval(() => {
    void refreshSessionHeartbeat();
  }, SESSION_HEARTBEAT_INTERVAL_MS);
};

export const getStoredSession = () => {
  try {
    return parseSession(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch (_error) {
    return null;
  }
};

export const saveSession = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const nextSession = { ...user };
  const serializedNextSession = serializeSession(nextSession);

  try {
    const currentRawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (serializedNextSession && currentRawSession === serializedNextSession) {
      ensureSessionHeartbeat();
      return parseSession(currentRawSession) ?? nextSession;
    }

    localStorage.setItem(SESSION_STORAGE_KEY, serializedNextSession ?? JSON.stringify(nextSession));
  } catch (error) {
    console.warn("[SessionManager] Session save failed:", error);
  }

  ensureSessionHeartbeat();
  emitSessionUpdate(nextSession);
  return nextSession;
};

export const clearSession = () => {
  stopSessionHeartbeat();

  const hadStoredSession = getStoredSession() !== null;

  try {
    if (localStorage.getItem(SESSION_STORAGE_KEY) !== null) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("[SessionManager] Session clear failed:", error);
  }

  if (hadStoredSession) {
    emitSessionUpdate(null);
  }
};

export const fetchSessionFromServer = async () => {
  const response = await fetch(toApiUrl(AUTH_SESSION_ENDPOINT), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    clearSession();
    return null;
  }

  if (!response.ok) {
    throw new Error(`Session fetch failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.success || !data?.user) {
    clearSession();
    return null;
  }

  return saveSession(data.user);
};

export const resolveSession = async () => {
  try {
    return await fetchSessionFromServer();
  } catch (error) {
    console.warn("[SessionManager] Session resolve failed:", error);
    return null;
  }
};

export const logoutSession = async () => {
  stopSessionHeartbeat();

  try {
    await fetch(toApiUrl(AUTH_LOGOUT_ENDPOINT), {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    console.warn("[SessionManager] Logout request failed:", error);
  } finally {
    clearSession();
  }
};

export { SESSION_EVENT_NAME };
