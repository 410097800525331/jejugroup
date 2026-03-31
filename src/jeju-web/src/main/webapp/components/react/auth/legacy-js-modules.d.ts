declare module "../../../core/constants/routes.js" {
  export const ROUTES: Record<string, unknown>;
}

declare module "../../../core/utils/path_resolver.js" {
  export const resolveRoute: (routeKey: string, params?: Record<string, unknown>) => string;
}

declare module "../../../core/auth/local_admin.js" {
  export const canUseAdminSurface: () => boolean;
  export const getStoredAdminSession: () => Record<string, unknown> | null;
  export const hasAdminAccess: (sessionData: Record<string, unknown> | null | undefined) => boolean;
  export const isLocalFrontEnvironment: () => boolean;
  export const resolveAdminSession: () => Record<string, unknown> | null;
}

declare module "../../../core/utils/sanitizer.js" {
  export const sanitizeHTML: (value: string) => string;
  export const validateParam: (value: string) => boolean;
}

declare module "../../../core/auth/session_manager.js" {
  export const saveSession: (user: Record<string, unknown>) => Record<string, unknown>;
}

declare module "../../../core/config/api_config.js" {
  export const API_BASE_URL: string;
}

declare module "../../../../core/constants/routes.js" {
  export const ROUTES: Record<string, unknown>;
}

declare module "../../../../core/utils/path_resolver.js" {
  export const resolveRoute: (routeKey: string, params?: Record<string, unknown>) => string;
}

declare module "../../../../core/auth/local_admin.js" {
  export const canUseAdminSurface: () => boolean;
  export const getStoredAdminSession: () => Record<string, unknown> | null;
  export const hasAdminAccess: (sessionData: Record<string, unknown> | null | undefined) => boolean;
  export const isLocalFrontEnvironment: () => boolean;
  export const resolveAdminSession: () => Record<string, unknown> | null;
}

declare module "../../../../core/utils/sanitizer.js" {
  export const sanitizeHTML: (value: string) => string;
  export const validateParam: (value: string) => boolean;
}

declare module "../../../../core/auth/session_manager.js" {
  export const saveSession: (user: Record<string, unknown>) => Record<string, unknown>;
}

declare module "../../../../core/config/api_config.js" {
  export const API_BASE_URL: string;
}
