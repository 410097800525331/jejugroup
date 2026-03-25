(() => {
    'use strict';

    const currentScript = document.currentScript;
    if (currentScript && !currentScript.dataset.adminRuntime) {
        currentScript.dataset.adminRuntime = new URL(currentScript.getAttribute('src') || '', window.location.href).href;
        currentScript.dataset.adminLoaded = 'true';
    }

    if (window.RBAC_CONFIG) {
        return;
    }

    const ADMIN_ROLES = Object.freeze({
        SUPER_ADMIN: 'SUPER_ADMIN',
        HOTEL_ADMIN: 'HOTEL_ADMIN',
        FLIGHT_ADMIN: 'FLIGHT_ADMIN',
        CS_ADMIN: 'CS_ADMIN'
    });

    const ADMIN_MENUS = Object.freeze([
        Object.freeze({
            id: 'dashboard',
            label: '대시보드',
            icon: '▣',
            path: 'dashboard.html',
            roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.HOTEL_ADMIN, ADMIN_ROLES.FLIGHT_ADMIN, ADMIN_ROLES.CS_ADMIN]
        }),
        Object.freeze({
            id: 'reservations',
            label: '예약/결제 관리',
            icon: '◎',
            path: 'reservations.html',
            roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.HOTEL_ADMIN, ADMIN_ROLES.FLIGHT_ADMIN]
        }),
        Object.freeze({
            id: 'lodging',
            label: '상품/숙박 관리',
            icon: '◈',
            path: 'lodging.html',
            roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.HOTEL_ADMIN, ADMIN_ROLES.FLIGHT_ADMIN]
        }),
        Object.freeze({
            id: 'members',
            label: '회원/권한/문의 관리',
            icon: '◉',
            path: 'members.html',
            roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.CS_ADMIN]
        }),
        Object.freeze({
            id: 'cms',
            label: '콘텐츠/문의 분류 관리',
            icon: '▤',
            path: 'cms.html',
            roles: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.CS_ADMIN]
        })
    ]);

    const getAccessibleMenus = (userRole) => {
        const effectiveRole = userRole === 'ADMIN' ? ADMIN_ROLES.SUPER_ADMIN : userRole;
        return ADMIN_MENUS
            .filter((menu) => menu.roles.includes(effectiveRole))
            .map((menu) => ({ ...menu }));
    };

    window.RBAC_CONFIG = Object.freeze({
        ROLES: ADMIN_ROLES,
        MENUS: ADMIN_MENUS,
        getAccessibleMenus
    });
})();
