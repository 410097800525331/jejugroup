declare module "../../../core/constants/routes.js" {
  export const ROUTES: Record<string, unknown>;
}

declare module "../../../core/utils/path_resolver.js" {
  export const resolveRoute: (routeKey: string, params?: Record<string, unknown>) => string;
}

declare module "../../../core/auth/local_admin.js" {
  export const isLocalFrontEnvironment: () => boolean;
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
  export const isLocalFrontEnvironment: () => boolean;
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
