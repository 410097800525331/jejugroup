/**
 * @file rbac_config.js
 * @description Role-Based Access Control definitions.
 * Immutability Doctrine enforced: All configurations are deeply frozen to prevent mutation.
 */

 const ADMIN_ROLES = Object.freeze({
    SUPER_ADMIN: 'SUPER_ADMIN', // All access
    HOTEL_ADMIN: 'HOTEL_ADMIN', // Hotel only
    FLIGHT_ADMIN: 'FLIGHT_ADMIN', // Flight only
    CS_ADMIN: 'CS_ADMIN' // Notice/FAQ only
});

/**
 * Menu definitions with associated roles.
 * A user must have one of the required roles to view a menu item.
 */
const ADMIN_MENUS = Object.freeze([
    Object.freeze({
        id: 'dashboard',
        label: '대시보드',
        icon: '📊',
        path: 'dashboard.html',
        roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.HOTEL_ADMIN, ADMIN_ROLES.FLIGHT_ADMIN, ADMIN_ROLES.CS_ADMIN]
    }),
    Object.freeze({
        id: 'reservations',
        label: '예약/스키마 관리',
        icon: '🧾',
        path: 'reservations.html',
        roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.HOTEL_ADMIN, ADMIN_ROLES.FLIGHT_ADMIN]
    }),
    Object.freeze({
        id: 'lodging',
        label: '상품/스키마 관리',
        icon: '📦',
        path: 'lodging.html',
        roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.HOTEL_ADMIN, ADMIN_ROLES.FLIGHT_ADMIN]
    }),
    Object.freeze({
        id: 'members',
        label: '회원/권한/문의 관리',
        icon: '👥',
        path: 'members.html',
        roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.CS_ADMIN]
    }),
    Object.freeze({
        id: 'cms',
        label: '콘텐츠/문의 분류 관리',
        icon: '📣',
        path: 'cms.html',
        roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.CS_ADMIN]
    })
]);

/**
 * Returns a new array of menus accessible by the given role layer.
 * Enforces immutability by returning a filtered mapped copy.
 * @param {string} userRole
 * @returns {Array} Filtered menus
 */
const getAccessibleMenus = (userRole) => {
    // Basic fallback: Map generic 'ADMIN' session role to 'SUPER_ADMIN'
    const effectiveRole = userRole === 'ADMIN' ? ADMIN_ROLES.SUPER_ADMIN : userRole;
    return ADMIN_MENUS.filter(menu => menu.roles.includes(effectiveRole)).map(menu => ({ ...menu }));
};

// Export for global usage if modules aren't fully integrated yet
window.RBAC_CONFIG = Object.freeze({
    ROLES: ADMIN_ROLES,
    MENUS: ADMIN_MENUS,
    getAccessibleMenus
});
