class ReservationDrawer {
    constructor() {
        this.isInitialized = false;
        this.isOpen = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        // 1. Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        const appRoot = window.__JEJU_ROUTE_NAVIGATOR__?.appRoot || new URL('../../../', import.meta.url).href;
        const cssUrl = new URL('components/ui/reservation_drawer/drawer.css', appRoot);
        cssUrl.searchParams.set('t', new Date().getTime()); // 강제 CSS 갱신 (Awwwards 덮어쓰기)
        console.log('[Drawer] Loading CSS from:', cssUrl.href);
        cssLink.href = cssUrl.href;
        document.head.appendChild(cssLink);

        // 2. Fetch HTML
        try {
            const htmlUrl = new URL('components/ui/reservation_drawer/drawer.html', appRoot).href;
            console.log('[Drawer] Fetching HTML from:', htmlUrl);
            const res = await fetch(htmlUrl);
            const htmlText = await res.text();
            
            const container = document.createElement('div');
            container.id = 'reservation-drawer-container';
            container.innerHTML = htmlText;
            document.body.appendChild(container); // Mount to DOM
            
            this.backdrop = document.getElementById('resDrawerBackdrop');
            this.panel = document.getElementById('resDrawerPanel');
            this.closeBtn = document.getElementById('resDrawerClose');
            
            if (!this.backdrop || !this.panel || !this.closeBtn) {
                console.error('[Drawer] Failed to query DOM elements. HTML Mismatch.');
                return;
            }
            
            this.bindEvents();
            
            // i18n Hydration
            if (typeof window.changeLanguage === 'function' && window.currentLang) {
                window.changeLanguage(window.currentLang);
            }

            this.isInitialized = true;
        } catch (e) {
            console.error('[Drawer] Failed to load reservation drawer UI', e);
        }
    }

    bindEvents() {
        const closeMod = () => this.close();
        
        this.closeBtn.addEventListener('click', closeMod);
        this.backdrop.addEventListener('click', closeMod);
        
        // History Shield: 모바일 스와이프나 브라우저 뒤로가기 시 튕기는 현상 방어
        window.addEventListener('popstate', (e) => {
            if (this.isOpen && e.state?.modal !== 'reservation') {
                this.close(true); // true = popstate 트리거로 인한 닫힘
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        const form = document.getElementById('resDrawerForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('인프라 준비 중: 예약 API 서버가 연결되지 않았습니다.');
        });
        
        // 내부 로그인 링크 등을 클릭하면 이탈하므로 팝업은 부드럽게 닫아줌
        this.panel.addEventListener('click', (e) => {
            const routeLink = e.target.closest('[data-route]');
            if (routeLink) {
                this.close();
            }
        });
    }

    async open() {
        if (!this.isInitialized) {
            await this.init();
        }
        if (this.isOpen) return;
        
        this.isOpen = true;
        
        // 브라우저 뒤로가기 스택 1칸 잡아먹기 (히스토리 가드)
        history.pushState({ modal: 'reservation' }, '', '#reservation');
        
        // Reflow & Paint Sync Guarantee
        this.backdrop.offsetHeight; 
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.backdrop.classList.add('active');
                this.panel.classList.add('active');
            });
        }, 50);
        
        // 스크롤 방지
        document.body.style.overflow = 'hidden';
    }

    close(isFromPopState = false) {
        if (!this.isOpen) return;
        this.isOpen = false;
        
        this.backdrop.classList.remove('active');
        this.panel.classList.remove('active');
        
        document.body.style.overflow = '';
        
        // 직접 닫은 경우에만 브라우저 스택에서 #reservation 제거
        if (!isFromPopState) {
            if (history.state && history.state.modal === 'reservation') {
                history.back();
            }
        }
    }
}

// ESM Export
export const reservationDrawer = new ReservationDrawer();
