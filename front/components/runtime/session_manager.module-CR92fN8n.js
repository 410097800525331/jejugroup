import { API_BASE_URL as a } from "./api_config.module-COHnAWbE.js";
const n = "userSession", i = "jeju:session-updated", l = "/api/auth/session", S = "/api/auth/logout", o = (e) => `${a}${e}`, u = (e) => {
  if (!e)
    return null;
  try {
    const s = JSON.parse(e);
    return s && typeof s == "object" ? { ...s } : null;
  } catch {
    return null;
  }
}, t = (e) => {
  try {
    const s = e ? { session: { ...e } } : { session: null };
    window.dispatchEvent(new CustomEvent(i, { detail: s }));
  } catch (s) {
    console.warn("[SessionManager] Session event dispatch failed:", s);
  }
}, f = () => {
  try {
    return u(localStorage.getItem(n));
  } catch {
    return null;
  }
}, p = (e) => {
  if (!e || typeof e != "object")
    return null;
  const s = { ...e };
  try {
    localStorage.setItem(n, JSON.stringify(s));
  } catch (c) {
    console.warn("[SessionManager] Session save failed:", c);
  }
  return t(s), s;
}, r = () => {
  try {
    localStorage.removeItem(n);
  } catch (e) {
    console.warn("[SessionManager] Session clear failed:", e);
  }
  t(null);
}, d = async () => {
  const e = await fetch(o(l), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });
  if (e.status === 401)
    return r(), null;
  if (!e.ok)
    throw new Error(`Session fetch failed: ${e.status}`);
  const s = await e.json();
  return !(s != null && s.success) || !(s != null && s.user) ? null : p(s.user);
}, E = async () => {
  const e = f();
  if (e)
    return e;
  try {
    return await d();
  } catch (s) {
    return console.warn("[SessionManager] Session resolve failed:", s), null;
  }
}, g = async () => {
  try {
    await fetch(o(S), {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });
  } catch (e) {
    console.warn("[SessionManager] Logout request failed:", e);
  } finally {
    r();
  }
};
export {
  i as SESSION_EVENT_NAME,
  r as clearSession,
  d as fetchSessionFromServer,
  f as getStoredSession,
  g as logoutSession,
  E as resolveSession,
  p as saveSession
};
