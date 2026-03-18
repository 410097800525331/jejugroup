/**
 * @file store.js
 * @description Immutable State Management for Admin Dashboard
 * Enforces Immutability Doctrine: State is never mutated directly.
 */

 const AdminStore = (() => {
    'use strict';

    // Initial State (Deep Freeze to prevent accidental mutation)
    const initialState = Object.freeze({
        kpi: Object.freeze({
            todayReservations: 124,
            revenue: '₩12,450,000',
            cancelRate: '3.2%',
            activeUsers: 890
        }),
        recentActivity: Object.freeze([
            { id: 1, type: 'RESERVATION', desc: '신라호텔 2박 예약 완료', time: '10분 전' },
            { id: 2, type: 'CANCEL', desc: '대한항공 편도 취소', time: '25분 전' },
            { id: 3, type: 'INQUIRY', desc: '결제 오류 문의 (VIP)', time: '1시간 전' }
        ]),
        ui: Object.freeze({
            sidebarOpen: true,
            activeMenu: 'dashboard',
            theme: localStorage.getItem('adminTheme') || 'system',
            domain: 'all' // 'all', 'flight', 'hotel', 'rentcar'
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

    return Object.freeze({
        getState,
        dispatch,
        subscribe
    });
})();
