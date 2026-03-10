/**
 * JEJU STAY Component: Header Logic
 */

let isHeaderScrollBound = false;
let isHeaderAuthSyncQueued = false;
const SESSION_STORAGE_KEY = 'userSession';
const SESSION_UPDATE_EVENT = 'jeju:session-updated';
const sessionManagerPromise = import('../../../core/auth/session_manager.js');
const localAdminPromise = import('../../../core/auth/local_admin.js');

const getCurrentHeader = () => {
    return document.getElementById('header') || document.querySelector('.header');
};

const syncHeaderScrollState = () => {
    const header = getCurrentHeader();
    if (!header) {
        return;
    }

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        return;
    }

    header.classList.remove('scrolled');
};

const bindHeaderScroll = () => {
    if (isHeaderScrollBound) {
        return;
    }

    isHeaderScrollBound = true;
    window.addEventListener('scroll', syncHeaderScrollState);
    syncHeaderScrollState();
};

const bindMegaPreview = () => {
    const megaItems = document.querySelectorAll('.mega-menu-item');

    megaItems.forEach((item) => {
        if (item.dataset.previewBound === 'true') {
            return;
        }

        item.dataset.previewBound = 'true';
        item.addEventListener('mouseenter', () => {
            const previewId = item.dataset.preview;
            const parentDropdown = item.closest('.mega-dropdown');
            if (!previewId || !parentDropdown) {
                return;
            }

            const previewArea = parentDropdown.querySelector('.mega-menu-preview');
            if (!previewArea) {
                return;
            }

            const previewImages = previewArea.querySelectorAll('.preview-image');
            previewImages.forEach((img) => {
                img.classList.toggle('active', img.id === previewId);
            });
        });
    });
};

const bindMobileMenuToggle = () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (!mobileMenuBtn || !mobileNav) {
        return;
    }

    if (mobileMenuBtn.dataset.mobileToggleBound === 'true') {
        return;
    }

    mobileMenuBtn.dataset.mobileToggleBound = 'true';
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
};

function initHeader() {
    const header = getCurrentHeader();
    if (!header) {
        return;
    }

    bindHeaderScroll();
    bindMegaPreview();
    bindMobileMenuToggle();

    if (typeof initStaggerNav === 'function') {
        initStaggerNav();
    }
}

window.initHeader = initHeader;

const getLoginButton = () => {
    return document.getElementById('headerLoginBtn') || document.getElementById('indexLoginBtn');
};

const updateLoginButtonAsLogout = (loginBtn) => {
    const span = loginBtn.querySelector('span');
    if (span) {
        span.textContent = '로그아웃';
    } else {
        loginBtn.textContent = '로그아웃';
    }

    const icon = loginBtn.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide', 'log-out');
    }

    loginBtn.href = '#';
    loginBtn.removeAttribute('data-route');

    if (loginBtn.dataset.logoutBound === 'true') {
        return;
    }

    loginBtn.dataset.logoutBound = 'true';
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const { logoutSession } = await sessionManagerPromise;
            await logoutSession();
        } catch (error) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        }
        window.location.reload();
    });
};

const appendIndexAdminLink = (headerUtil) => {
    if (headerUtil.querySelector('[data-route="ADMIN.DASHBOARD"]')) {
        return;
    }

    const adminLink = document.createElement('a');
    adminLink.id = 'indexAdminBtn';
    adminLink.href = '#';
    adminLink.className = 'util-link route-link';
    adminLink.setAttribute('data-route', 'ADMIN.DASHBOARD');
    adminLink.style.color = '#FF5000';
    adminLink.style.fontWeight = '700';
    adminLink.textContent = '관리자 페이지';

    const divider = document.createElement('span');
    divider.className = 'util-divider';
    divider.textContent = '|';

    // 최신 트렌드: 왼쪽 끝에 붙여서 다른 유틸 메뉴와 구분
    headerUtil.prepend(adminLink, divider);
};

const resolveSessionData = async () => {
    try {
        const { resolveSession } = await sessionManagerPromise;
        return await resolveSession();
    } catch (error) {
        console.warn('[Header] Session resolve failed:', error);
        try {
            const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
            return rawSession ? JSON.parse(rawSession) : null;
        } catch (parseError) {
            return null;
        }
    }
};

const syncHeaderAuthState = async () => {
    const adminBtn = document.getElementById('headerAdminBtn');
    const loginBtn = getLoginButton();
    const indexHeaderUtil = document.getElementById('index-header-util');

    try {
        const [sessionData, { isLocalFrontEnvironment }] = await Promise.all([
            resolveSessionData(),
            localAdminPromise
        ]);

        if (sessionData && loginBtn) {
            updateLoginButtonAsLogout(loginBtn);
        }

        const canOpenAdmin = isLocalFrontEnvironment();
        if (canOpenAdmin && adminBtn) {
            adminBtn.style.display = 'flex';
        }

        const adminExists = indexHeaderUtil
            ? Array.from(indexHeaderUtil.querySelectorAll('.util-link'))
                .some(link => link.getAttribute('data-route') === 'ADMIN.DASHBOARD')
            : false;

        if (canOpenAdmin && !adminExists && indexHeaderUtil) {
            appendIndexAdminLink(indexHeaderUtil);
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    } catch (error) {
        console.error('Session parsing error', error);
    }
};

const queueHeaderAuthSync = () => {
    if (isHeaderAuthSyncQueued) {
        return;
    }

    isHeaderAuthSyncQueued = true;
    setTimeout(async () => {
        isHeaderAuthSyncQueued = false;
        await syncHeaderAuthState();
    }, 0);
};

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    queueHeaderAuthSync();
});

document.addEventListener('mainHeaderLoaded', () => {
    initHeader();
    queueHeaderAuthSync();
});

window.addEventListener('storage', (event) => {
    if (event.key === SESSION_STORAGE_KEY) {
        queueHeaderAuthSync();
    }
});

window.addEventListener(SESSION_UPDATE_EVENT, () => {
    queueHeaderAuthSync();
});