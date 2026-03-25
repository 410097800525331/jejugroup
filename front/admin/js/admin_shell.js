(() => {
    'use strict';

    const currentScript = document.currentScript;
    if (currentScript && !currentScript.dataset.adminRuntime) {
        currentScript.dataset.adminRuntime = currentScript.src || new URL(currentScript.getAttribute('src') || '', window.location.href).href;
        currentScript.dataset.adminLoaded = 'true';
    }

    if (window.AdminShell) {
        return;
    }

    const SECTION_DEFS = Object.freeze({
        dashboard: Object.freeze({
            id: 'dashboard',
            menuId: 'dashboard',
            pagePath: 'dashboard.html',
            scriptPath: '../js/dashboard.js',
            title: '제주 그룹 관리자 대시보드'
        }),
        reservations: Object.freeze({
            id: 'reservations',
            menuId: 'reservations',
            pagePath: 'reservations.html',
            scriptPath: '../js/reservations.js',
            title: '예약 관리'
        }),
        lodging: Object.freeze({
            id: 'lodging',
            menuId: 'lodging',
            pagePath: 'lodging.html',
            scriptPath: '../js/lodging.js',
            title: '숙박 관리'
        }),
        members: Object.freeze({
            id: 'members',
            menuId: 'members',
            pagePath: 'members.html',
            scriptPath: '../js/members.js',
            title: '회원 관리'
        }),
        cms: Object.freeze({
            id: 'cms',
            menuId: 'cms',
            pagePath: 'cms.html',
            scriptPath: '../js/cms.js',
            title: 'CMS 관리'
        })
    });

    const state = {
        bootPromise: null,
        session: null,
        sharedReady: false,
        sharedBound: false,
        sharedUnsub: null,
        activeSectionId: null,
        mountedSectionId: null,
        mountedRoot: null,
        sectionRegistry: new Map(),
        navigationToken: 0,
        pendingSectionId: null,
        pendingNavigationToken: 0,
        loadedScripts: new Map(),
        sharedScriptPromise: null,
        cachedMarkup: new Map(),
        sectionStateSnapshots: new Map()
    };

    const escapeHtml = (value) => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const getSectionIdFromPath = (pathname = window.location.pathname) => {
        const fileName = pathname.split('/').pop() || 'dashboard.html';
        return fileName.replace(/\.html?$/i, '');
    };

    const getSectionDef = (sectionId) => SECTION_DEFS[sectionId] ?? SECTION_DEFS.dashboard;

    const beginNavigation = (sectionId) => {
        const token = state.navigationToken + 1;
        state.navigationToken = token;
        state.pendingSectionId = sectionId;
        state.pendingNavigationToken = token;
        return token;
    };

    const isCurrentNavigation = (sectionId, token) => (
        token === state.pendingNavigationToken && state.pendingSectionId === sectionId
    );

    const getCurrentMain = () => document.querySelector('main.admin-main');

    const getSidebarMenu = () => document.getElementById('admin-sidebar-menu');

    const getSharedControls = () => ({
        layout: document.querySelector('.admin-layout'),
        sidebar: document.getElementById('admin-sidebar'),
        sidebarToggle: document.getElementById('admin-sidebar-toggle'),
        profileContainer: document.getElementById('admin-profile-container'),
        profileTrigger: document.getElementById('admin-profile-trigger'),
        logoutBtn: document.getElementById('admin-logout-btn'),
        userName: document.getElementById('admin-user-name'),
        userRole: document.getElementById('admin-user-role'),
        themeBtns: Array.from(document.querySelectorAll('.theme-btn'))
    });

    const cleanupBag = () => {
        const callbacks = [];
        return {
            add(callback) {
                if (typeof callback === 'function') {
                    callbacks.push(callback);
                }
            },
            run() {
                while (callbacks.length) {
                    const callback = callbacks.pop();
                    try {
                        callback();
                    } catch (error) {
                        console.warn('[AdminShell] Cleanup failed:', error);
                    }
                }
            }
        };
    };

    const resolveUrl = (path) => new URL(path, window.location.href).href;
    const runtimeBaseUrl = currentScript?.src || window.location.href;
    const resolveRuntimeUrl = (path) => new URL(path, runtimeBaseUrl).href;

    const sharedRuntimeGuards = Object.freeze({
        [resolveRuntimeUrl('../js/auth_guard.js')]: () => Boolean(window.AdminAuth),
        [resolveRuntimeUrl('../js/rbac_config.js')]: () => Boolean(window.RBAC_CONFIG),
        [resolveRuntimeUrl('../js/sidebar_ui.js')]: () => Boolean(window.AdminSidebarUI),
        [resolveRuntimeUrl('../js/store.js')]: () => Boolean(window.AdminStore),
        [resolveRuntimeUrl('../js/api_client.js')]: () => Boolean(window.AdminApiClient),
        [resolveRuntimeUrl('../js/portal_nav.js')]: () => Boolean(window.AdminPortalNav)
    });

    const ensureScriptOnce = (src) => {
        if (!src) {
            return Promise.resolve(false);
        }

        if (state.loadedScripts.has(src)) {
            return state.loadedScripts.get(src);
        }

        const existing = document.querySelector(`script[data-admin-runtime="${src}"]`);
        if (existing) {
            if (existing.dataset.adminFailed === 'true') {
                existing.remove();
            } else {
                const ready = sharedRuntimeGuards[src]?.() || existing.dataset.adminLoaded === 'true';
                const readyPromise = ready
                    ? Promise.resolve(true)
                    : new Promise((resolve) => {
                        existing.addEventListener('load', () => resolve(true), { once: true });
                        existing.addEventListener('error', () => resolve(false), { once: true });
                    });
                state.loadedScripts.set(src, readyPromise);
                return readyPromise;
            }
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.dataset.adminRuntime = src;
            script.onload = () => {
                script.dataset.adminLoaded = 'true';
                resolve(true);
            };
            script.onerror = (error) => {
                state.loadedScripts.delete(src);
                script.dataset.adminFailed = 'true';
                script.remove();
                reject(error);
            };
            document.head.appendChild(script);
        });

        state.loadedScripts.set(src, promise);
        return promise;
    };

    const loadSectionScript = (sectionId) => {
        const def = getSectionDef(sectionId);
        return ensureScriptOnce(resolveRuntimeUrl(def.scriptPath));
    };

    const ensureSharedRuntime = async () => {
        if (state.sharedScriptPromise) {
            return state.sharedScriptPromise;
        }

        const sharedScriptPaths = [
            '../js/auth_guard.js',
            '../js/rbac_config.js',
            '../js/sidebar_ui.js',
            '../js/store.js',
            '../js/api_client.js',
            '../js/portal_nav.js'
        ];

        state.sharedScriptPromise = (async () => {
            for (const path of sharedScriptPaths) {
                await ensureScriptOnce(resolveRuntimeUrl(path));
            }
            return true;
        })().catch((error) => {
            state.sharedScriptPromise = null;
            throw error;
        });

        return state.sharedScriptPromise;
    };

    const waitForSession = async () => {
        if (state.session) {
            return state.session;
        }

        const session = await window.AdminAuth?.waitForAdminSession?.();
        state.session = session ?? null;
        return state.session;
    };

    const renderSidebarMenus = (role) => {
        const sidebarMenu = getSidebarMenu();
        if (!sidebarMenu || !window.RBAC_CONFIG?.getAccessibleMenus) {
            return;
        }

        const accessibleMenus = window.RBAC_CONFIG.getAccessibleMenus(role);
        sidebarMenu.innerHTML = accessibleMenus.map((menu) => {
            const sectionId = menu.id;
            const activeClass = sectionId === state.activeSectionId ? 'active' : '';
            return `
                <a href="${escapeHtml(menu.path)}" class="admin-menu-item ${activeClass}" data-admin-section="${escapeHtml(sectionId)}" data-id="${escapeHtml(menu.id)}">
                    <span class="admin-menu-icon">${menu.icon}</span>
                    <span>${escapeHtml(menu.label)}</span>
                </a>
            `;
        }).join('');
    };

    const syncSharedTheme = (theme) => {
        const themeValue = theme || 'system';
        const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeTheme = themeValue === 'system' ? (isSystemDark ? 'dark' : 'light') : themeValue;
        document.body.setAttribute('data-theme', activeTheme);

        const controls = getSharedControls();
        controls.themeBtns.forEach((button) => {
            button.classList.toggle('active', button.dataset.theme === themeValue);
        });
    };

    const syncSidebarUi = () => {
        const controls = getSharedControls();
        const sidebarUi = window.AdminSidebarUI;
        if (!sidebarUi || !controls.layout || !controls.sidebar) {
            return;
        }

        const isOpen = window.AdminStore?.getState?.().ui?.sidebarOpen ?? sidebarUi.getInitialSidebarOpen?.() ?? true;
        sidebarUi.applySidebarUI({
            layout: controls.layout,
            sidebar: controls.sidebar,
            isOpen
        });
    };

    const syncSharedProfile = (session) => {
        const controls = getSharedControls();
        if (controls.userName) {
            controls.userName.textContent = session?.name || '관리자';
        }
        if (controls.userRole) {
            controls.userRole.textContent = session?.role || '-';
        }
    };

    const updateActiveMenu = (sectionId) => {
        const sidebarMenu = getSidebarMenu();
        if (!sidebarMenu) {
            return;
        }

        sidebarMenu.querySelectorAll('.admin-menu-item').forEach((item) => {
            item.classList.toggle('active', item.dataset.adminSection === sectionId);
        });
    };

    const cloneSectionState = (sectionState) => {
        if (!sectionState || typeof sectionState !== 'object') {
            return null;
        }

        return { ...sectionState };
    };

    const captureMountedSectionState = (sectionId, root) => {
        if (!sectionId) {
            return null;
        }

        const entry = state.sectionRegistry.get(sectionId);
        if (!entry || typeof entry.getState !== 'function') {
            return null;
        }

        try {
            const snapshot = entry.getState({
                root: root ?? getCurrentMain(),
                shell: window.AdminShell,
                session: state.session,
                sectionId
            });
            if (snapshot && typeof snapshot === 'object') {
                const clonedSnapshot = cloneSectionState(snapshot);
                state.sectionStateSnapshots.set(sectionId, clonedSnapshot);
                return clonedSnapshot;
            }
        } catch (error) {
            console.warn('[AdminShell] Section state snapshot failed:', error);
        }

        return null;
    };

    const activateSection = async (sectionId, options = {}) => {
        const {
            force = false,
            navigationToken = state.pendingNavigationToken,
            restoreSectionState = false,
            sectionState = null
        } = options;
        const def = getSectionDef(sectionId);
        const mountEntry = state.sectionRegistry.get(sectionId);
        const root = getCurrentMain();
        if (!mountEntry || !root) {
            return false;
        }

        if (navigationToken && !isCurrentNavigation(sectionId, navigationToken)) {
            return false;
        }

        if (!force && state.mountedSectionId === sectionId && state.mountedRoot === root) {
            return true;
        }

        if (state.mountedSectionId && state.mountedSectionId !== sectionId) {
            captureMountedSectionState(state.mountedSectionId, state.mountedRoot || root);
        }

        if (typeof state.cleanupSection === 'function') {
            state.cleanupSection();
        }
        state.cleanupSection = null;

        state.activeSectionId = sectionId;
        state.mountedSectionId = sectionId;
        state.mountedRoot = root;
        document.body.dataset.adminSection = sectionId;
        document.title = def.title;
        updateActiveMenu(sectionId);
        syncSharedProfile(state.session);
        syncSharedTheme(window.AdminStore?.getState?.().ui?.theme || 'system');

        const cleanup = await mountEntry.mount({
            root,
            shell: window.AdminShell,
            session: state.session,
            sectionId,
            sectionState: restoreSectionState ? (sectionState ?? cloneSectionState(state.sectionStateSnapshots.get(sectionId))) : null
        });

        if (navigationToken && !isCurrentNavigation(sectionId, navigationToken)) {
            if (typeof cleanup === 'function') {
                try {
                    cleanup();
                } catch (error) {
                    console.warn('[AdminShell] Stale section cleanup failed:', error);
                }
            }
            return false;
        }

        if (typeof cleanup === 'function') {
            state.cleanupSection = cleanup;
        }

        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }

        return true;
    };

    const ensureSharedChrome = async () => {
        await ensureSharedRuntime();

        if (state.sharedReady) {
            return state.session;
        }

        const session = await waitForSession();
        if (!session?.role) {
            return null;
        }

        syncSharedProfile(session);
        renderSidebarMenus(session.role);
        syncSidebarUi();
        syncSharedTheme(window.AdminStore?.getState?.().ui?.theme || 'system');

        const controls = getSharedControls();
        if (!state.sharedBound) {
            state.sharedBound = true;
            const sharedCleanup = cleanupBag();

            if (controls.sidebarMenu?.length) {
                // no-op
            }

            if (controls.sidebarToggle) {
                const onToggle = () => window.AdminStore?.dispatch?.({ type: 'UI/TOGGLE_SIDEBAR' });
                controls.sidebarToggle.addEventListener('click', onToggle);
                sharedCleanup.add(() => controls.sidebarToggle.removeEventListener('click', onToggle));
            }

            if (controls.profileTrigger && controls.profileContainer) {
                const onTrigger = (event) => {
                    event.stopPropagation();
                    controls.profileContainer.classList.toggle('active');
                };
                const onDocumentClick = (event) => {
                    if (!controls.profileContainer.contains(event.target)) {
                        controls.profileContainer.classList.remove('active');
                    }
                };
                controls.profileTrigger.addEventListener('click', onTrigger);
                document.addEventListener('click', onDocumentClick);
                sharedCleanup.add(() => controls.profileTrigger.removeEventListener('click', onTrigger));
                sharedCleanup.add(() => document.removeEventListener('click', onDocumentClick));
            }

            if (controls.logoutBtn) {
                const onLogout = async () => {
                    try {
                        const { logoutSession } = await import('../../core/auth/session_manager.js');
                        await logoutSession();
                    } catch (_error) {
                        window.localStorage.removeItem('userSession');
                    }
                    window.location.replace(new URL('index.html', window.location.href).href);
                };
                controls.logoutBtn.addEventListener('click', onLogout);
                sharedCleanup.add(() => controls.logoutBtn.removeEventListener('click', onLogout));
            }

            controls.themeBtns.forEach((button) => {
                const onThemeClick = () => {
                    const selectedTheme = button.dataset.theme || 'system';
                    window.localStorage.setItem('adminTheme', selectedTheme);
                    window.AdminStore?.dispatch?.({ type: 'UI/SET_THEME', payload: selectedTheme });
                };
                button.addEventListener('click', onThemeClick);
                sharedCleanup.add(() => button.removeEventListener('click', onThemeClick));
            });

            const sidebarMenu = getSidebarMenu();
            if (sidebarMenu) {
                const onSidebarClick = async (event) => {
                    const link = event.target.closest('a[data-admin-section]');
                    if (!link || !sidebarMenu.contains(link)) {
                        return;
                    }

                    const targetSectionId = link.dataset.adminSection;
                    if (!targetSectionId || targetSectionId === state.activeSectionId) {
                        event.preventDefault();
                        return;
                    }

                    event.preventDefault();
                    await window.AdminShell.navigateToSection(targetSectionId);
                };
                sidebarMenu.addEventListener('click', onSidebarClick);
                sharedCleanup.add(() => sidebarMenu.removeEventListener('click', onSidebarClick));
            }

            if (window.AdminStore?.subscribe) {
                state.sharedUnsub = window.AdminStore.subscribe((nextState) => {
                    syncSidebarUi();
                    syncSharedTheme(nextState.ui.theme);
                    renderSidebarMenus(session.role);
                    updateActiveMenu(state.activeSectionId);
                });
            }

            if (window.matchMedia) {
                const media = window.matchMedia('(prefers-color-scheme: dark)');
                const onThemeChange = () => {
                    const currentTheme = window.AdminStore?.getState?.().ui?.theme || 'system';
                    if (currentTheme === 'system') {
                        syncSharedTheme('system');
                    }
                };
                if (media.addEventListener) {
                    media.addEventListener('change', onThemeChange);
                    sharedCleanup.add(() => media.removeEventListener('change', onThemeChange));
                }
            }

            state.sharedCleanup = sharedCleanup;
        }

        state.sharedReady = true;
        return session;
    };

    const bootSection = async (sectionId, options = {}) => {
        const targetSectionId = sectionId || getSectionIdFromPath();
        if (state.pendingSectionId && state.pendingSectionId !== targetSectionId) {
            return state.session;
        }

        const navigationToken = state.pendingNavigationToken || beginNavigation(targetSectionId);

        try {
            await ensureSharedChrome();
            if (!isCurrentNavigation(targetSectionId, navigationToken)) {
                return state.session;
            }

            const activated = await activateSection(targetSectionId, {
                ...options,
                navigationToken
            });
            if (!activated) {
                if (!isCurrentNavigation(targetSectionId, navigationToken)) {
                    return state.session;
                }
                throw new Error(`Admin section boot failed: ${targetSectionId}`);
            }
        } catch (error) {
            if (!isCurrentNavigation(targetSectionId, navigationToken)) {
                return state.session;
            }
            throw error;
        }

        return state.session;
    };

    const bootstrapInitialSection = () => {
        const initialSectionId = state.pendingSectionId || getSectionIdFromPath();
        state.pendingSectionId = initialSectionId;
        void loadSectionScript(initialSectionId);
    };

    const registerSection = (sectionId, entry) => {
        if (!sectionId || !entry || typeof entry.mount !== 'function') {
            return;
        }

        state.sectionRegistry.set(sectionId, {
            sectionId,
            ...entry
        });

        if (state.pendingSectionId === sectionId && state.sharedReady) {
            void activateSection(sectionId, {
                navigationToken: state.pendingNavigationToken
            });
        }
    };

    const loadSectionMarkup = async (sectionId) => {
        const def = getSectionDef(sectionId);
        const pageUrl = resolveUrl(`../pages/${def.pagePath}`);
        const response = await fetch(pageUrl, { credentials: 'include' });
        if (!response.ok) {
            throw new Error(`Admin page request failed: ${response.status}`);
        }

        const html = await response.text();
        state.cachedMarkup.set(sectionId, html);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const main = doc.querySelector('main.admin-main');
        if (!main) {
            throw new Error(`Missing admin main content for ${sectionId}`);
        }

        return {
            html,
            title: doc.title || def.title,
            main
        };
    };

    const navigateToSection = async (sectionId, options = {}) => {
        const def = getSectionDef(sectionId);
        const currentSectionId = state.activeSectionId || getSectionIdFromPath();
        if (!options.force && currentSectionId === sectionId) {
            return;
        }

        const navigationToken = beginNavigation(sectionId);
        const previousSectionId = currentSectionId;
        const previousTitle = document.title;
        const previousUrl = window.location.href;
        const previousMain = getCurrentMain();
        const previousMainHtml = previousMain?.outerHTML || '';
        const previousSectionState = previousSectionId
            ? captureMountedSectionState(previousSectionId, previousMain)
            : null;
        let swappedMain = false;

        try {
            const markup = await loadSectionMarkup(sectionId);
            if (!isCurrentNavigation(sectionId, navigationToken)) {
                return;
            }

            const currentMain = getCurrentMain();
            if (currentMain) {
                currentMain.outerHTML = markup.main.outerHTML;
                swappedMain = true;
            }

            if (!isCurrentNavigation(sectionId, navigationToken)) {
                return;
            }

            const pageUrl = resolveUrl(`../pages/${def.pagePath}`);
            if (options.replaceState) {
                window.history.replaceState({ adminSection: sectionId }, '', pageUrl);
            } else {
                window.history.pushState({ adminSection: sectionId }, '', pageUrl);
            }

            document.title = markup.title;
            state.activeSectionId = sectionId;
            state.mountedRoot = getCurrentMain();
            updateActiveMenu(sectionId);
            syncSharedTheme(window.AdminStore?.getState?.().ui?.theme || 'system');
            syncSidebarUi();

            if (!state.sectionRegistry.has(sectionId)) {
                await loadSectionScript(sectionId);
                if (!isCurrentNavigation(sectionId, navigationToken)) {
                    return;
                }
                return;
            }

            await activateSection(sectionId, { force: true, navigationToken });
        } catch (error) {
            if (!isCurrentNavigation(sectionId, navigationToken)) {
                return;
            }

            const rollbackSectionState = !swappedMain && previousSectionId
                ? captureMountedSectionState(previousSectionId, getCurrentMain())
                : null;
            const sectionStateForRollback = rollbackSectionState ?? previousSectionState;

            if (swappedMain && previousMainHtml) {
                const currentMain = getCurrentMain();
                if (currentMain) {
                    currentMain.outerHTML = previousMainHtml;
                }
            }

            if (window.location.href !== previousUrl) {
                window.history.replaceState({ adminSection: previousSectionId }, '', previousUrl);
            }

            document.title = previousTitle;
            state.activeSectionId = previousSectionId;
            state.mountedSectionId = previousSectionId;
            state.mountedRoot = getCurrentMain();
            state.pendingSectionId = previousSectionId;
            state.pendingNavigationToken = state.navigationToken;

            if (previousSectionId && state.sectionRegistry.has(previousSectionId)) {
                try {
                    await activateSection(previousSectionId, {
                        force: true,
                        navigationToken: state.navigationToken,
                        restoreSectionState: true,
                        sectionState: sectionStateForRollback
                    });
                    return;
                } catch (restoreError) {
                    console.warn('[AdminShell] Section rollback remount failed:', restoreError);
                }
            }

            updateActiveMenu(previousSectionId);
            syncSharedTheme(window.AdminStore?.getState?.().ui?.theme || 'system');
            syncSidebarUi();
            console.warn('[AdminShell] Section navigation failed:', error);
        }
    };

    window.addEventListener('popstate', () => {
        const sectionId = getSectionIdFromPath();
        if (sectionId && sectionId !== state.activeSectionId) {
            void navigateToSection(sectionId, { replaceState: true, force: true });
        }
    });

    window.AdminShell = Object.freeze({
        sections: SECTION_DEFS,
        getSectionDefinition: getSectionDef,
        getCurrentSectionId: () => state.activeSectionId || getSectionIdFromPath(),
        getSession: () => state.session,
        getMainRoot: getCurrentMain,
        loadSectionMarkup,
        loadSectionScript,
        navigateToSection,
        registerSection,
        bootSection,
        ensureSharedChrome,
        utils: Object.freeze({
            escapeHtml,
            cleanupBag,
            resolveUrl
        })
    });

    state.pendingSectionId = getSectionIdFromPath();
    bootstrapInitialSection();
})();
