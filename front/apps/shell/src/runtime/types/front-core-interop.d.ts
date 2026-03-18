declare module "@front-core-auth/local_admin.js" {
  export const buildLocalFrontAdminSession: () => Readonly<{
    id: string;
    name: string;
    email: string;
    role: string;
    roles: string[];
    authSource: string;
    isLocalAdmin: boolean;
  }>;
  export const isLocalFrontEnvironment: () => boolean;
}

declare module "@front-core-auth/session_manager.js" {
  export const SESSION_EVENT_NAME: string;
  export const clearSession: () => void;
  export const fetchSessionFromServer: () => Promise<Record<string, unknown> | null>;
  export const getStoredSession: () => Record<string, unknown> | null;
  export const logoutSession: () => Promise<void>;
  export const resolveSession: () => Promise<Record<string, unknown> | null>;
  export const saveSession: (user: Record<string, unknown>) => Record<string, unknown> | null;
}

declare module "@front-core-utils/path_resolver.js" {
  export const resolveRoute: (routeKey: string, params?: Record<string, unknown>) => string;
}

declare module "@front-core-utils/router_binder.js" {
  export const initRouterBinder: () => void;
  export const syncRouteBindings: (root?: Document | Element) => void;
}
