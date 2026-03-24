/**
 * @file store.js
 * @description Immutable State Management for Admin Dashboard
 * Enforces Immutability Doctrine: State is never mutated directly.
 */

const AdminStore = (() => {
    'use strict';

    const sidebarUi = window.AdminSidebarUI;
    const storeSeed = window.AdminStoreSeed ?? {};
    const defaultKpi = Object.freeze({
        todayReservations: 0,
        revenue: '0',
        cancelRate: '0%',
        activeUsers: 0
    });
    const defaultRecentActivity = Object.freeze([]);

    const normalizeKpi = (kpi) => ({
        ...defaultKpi,
        ...(kpi && typeof kpi === 'object' ? kpi : {})
    });

    const normalizeRecentActivity = (recentActivity) => (
        Array.isArray(recentActivity) ? recentActivity : defaultRecentActivity
    );

    // Initial State (Deep Freeze to prevent accidental mutation)
    const initialState = Object.freeze({
        kpi: Object.freeze(normalizeKpi(storeSeed.kpi)),
        recentActivity: Object.freeze(normalizeRecentActivity(storeSeed.recentActivity)),
        ui: Object.freeze({
            sidebarOpen: sidebarUi?.getInitialSidebarOpen?.() ?? (window.innerWidth > 1024),
            activeMenu: storeSeed.ui?.activeMenu ?? 'dashboard',
            theme: localStorage.getItem('adminTheme') || storeSeed.ui?.theme || 'system',
            domain: storeSeed.ui?.domain ?? 'all' // 'all', 'flight', 'hotel', 'rentcar'
        })
    });

    let state = initialState;
    const listeners = new Set();

    /**
     * Get current state
     * @returns {Object} A deep frozen copy of the current state
     */
    const getState = () => state;

    /**
     * Dispatch an action to update state immutably
     * @param {Object} action - { type: string, payload: any }
     */
    const dispatch = (action) => {
        let nextState = state;

        switch (action.type) {
            case 'UI/TOGGLE_SIDEBAR':
                nextState = Object.freeze({
                    ...state,
                    ui: Object.freeze({
                        ...state.ui,
                        sidebarOpen: !state.ui.sidebarOpen
                    })
                });
                break;
            case 'UI/SET_ACTIVE_MENU':
                nextState = Object.freeze({
                    ...state,
                    ui: Object.freeze({
                        ...state.ui,
                        activeMenu: action.payload
                    })
                });
                break;
            case 'UI/SET_THEME':
                nextState = Object.freeze({
                    ...state,
                    ui: Object.freeze({
                        ...state.ui,
                        theme: action.payload
                    })
                });
                break;
            case 'UI/SET_DOMAIN':
                nextState = Object.freeze({
                    ...state,
                    ui: Object.freeze({
                        ...state.ui,
                        domain: action.payload
                    })
                });
                break;
            case 'KPI/UPDATE_METRICS':
                nextState = Object.freeze({
                    ...state,
                    kpi: Object.freeze({
                        ...state.kpi,
                        ...action.payload
                    })
                });
                break;
            default:
                return; // No change
        }

        if (nextState !== state) {
            if (nextState.ui?.sidebarOpen !== state.ui?.sidebarOpen) {
                sidebarUi?.persistSidebarOpen?.(nextState.ui.sidebarOpen);
            }
            state = nextState;
            notifyListeners();
        }
    };

    /**
     * Subscribe to state changes
     * @param {Function} listener
     * @returns {Function} Unsubscribe function
     */
    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const notifyListeners = () => {
        listeners.forEach(listener => listener(state));
    };

    const isSameState = (left, right) => JSON.stringify(left) === JSON.stringify(right);

    const hydrateFromSeed = (seed) => {
        if (!seed || typeof seed !== 'object') return;

        window.AdminStoreSeed = seed;

        const nextState = Object.freeze({
            ...state,
            kpi: Object.freeze(normalizeKpi(seed.kpi ?? state.kpi)),
            recentActivity: Object.freeze(normalizeRecentActivity(seed.recentActivity ?? state.recentActivity)),
            ui: Object.freeze({
                ...state.ui,
                activeMenu: seed.ui?.activeMenu ?? state.ui.activeMenu,
                theme: localStorage.getItem('adminTheme') || seed.ui?.theme || state.ui.theme,
                domain: seed.ui?.domain ?? state.ui.domain
            })
        });

        if (!isSameState(nextState, state)) {
            state = nextState;
            notifyListeners();
        }
    };

    import('../data/store-seed.js')
        .then(({ default: seed }) => {
            hydrateFromSeed(seed);
        })
        .catch((error) => {
            console.warn('[AdminStore] Failed to load store seed module:', error);
        });

    return Object.freeze({
        getState,
        dispatch,
        subscribe
    });
})();
