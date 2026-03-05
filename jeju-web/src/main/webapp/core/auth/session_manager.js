import { API_BASE_URL } from '../config/api_config.js';

const SESSION_STORAGE_KEY = 'userSession';
const SESSION_EVENT_NAME = 'jeju:session-updated';
const AUTH_SESSION_ENDPOINT = '/api/auth/session';
const AUTH_LOGOUT_ENDPOINT = '/api/auth/logout';

const toApiUrl = (path) => `${API_BASE_URL}${path}`;

const parseSession = (rawValue) => {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue);
        return parsed && typeof parsed === 'object' ? { ...parsed } : null;
    } catch (error) {
        return null;
    }
};

const emitSessionUpdate = (session) => {
    try {
        const detail = session ? { session: { ...session } } : { session: null };
        window.dispatchEvent(new CustomEvent(SESSION_EVENT_NAME, { detail }));
    } catch (error) {
        console.warn('[SessionManager] Session event dispatch failed:', error);
    }
};

export const getStoredSession = () => {
    try {
        return parseSession(localStorage.getItem(SESSION_STORAGE_KEY));
    } catch (error) {
        return null;
    }
};

export const saveSession = (user) => {
    if (!user || typeof user !== 'object') {
        return null;
    }

    const nextSession = { ...user };
    try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    } catch (error) {
        console.warn('[SessionManager] Session save failed:', error);
    }
    emitSessionUpdate(nextSession);
    return nextSession;
};

export const clearSession = () => {
    try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
        console.warn('[SessionManager] Session clear failed:', error);
    }
    emitSessionUpdate(null);
};

export const fetchSessionFromServer = async () => {
    const response = await fetch(toApiUrl(AUTH_SESSION_ENDPOINT), {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
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
        return null;
    }

    return saveSession(data.user);
};

export const resolveSession = async () => {
    const localSession = getStoredSession();
    if (localSession) {
        return localSession;
    }

    try {
        return await fetchSessionFromServer();
    } catch (error) {
        console.warn('[SessionManager] Session resolve failed:', error);
        return null;
    }
};

export const logoutSession = async () => {
    try {
        await fetch(toApiUrl(AUTH_LOGOUT_ENDPOINT), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
    } catch (error) {
        console.warn('[SessionManager] Logout request failed:', error);
    } finally {
        clearSession();
    }
};

export { SESSION_EVENT_NAME };
