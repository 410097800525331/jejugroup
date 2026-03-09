/**
 * 로컬 프런트 환경에서만 허용하는 관리자 접근 헬퍼
 */

const LOCAL_ADMIN_SOURCE = 'LOCAL_FRONT_ADMIN';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);

export const isLocalFrontEnvironment = () => {
    return window.location.protocol === 'file:' || LOCAL_HOSTS.has(window.location.hostname);
};

export const buildLocalFrontAdminSession = () => {
    return Object.freeze({
        id: 'local-admin',
        name: '로컬 관리자',
        email: 'admin@local.jejugroup',
        role: 'ADMIN',
        roles: ['ADMIN', 'SUPER_ADMIN'],
        authSource: LOCAL_ADMIN_SOURCE,
        isLocalAdmin: true
    });
};
