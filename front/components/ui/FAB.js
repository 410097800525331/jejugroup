/* ========== Global FAB System (Hotel Card-Key Edition) ========== */
/* Uses GSAP for animation */

const FABState = {
    currency: localStorage.getItem('jeju_fab_currency') || 'KRW',
    language: localStorage.getItem('jeju_fab_lang') || 'ko',
    wishlist: JSON.parse(localStorage.getItem('jeju_wishlist') || '[]'),
    
    setCurrencyAndLang(curr, lang) {
        this.currency = curr;
        this.language = lang;
        localStorage.setItem('jeju_fab_currency', curr);
        localStorage.setItem('jeju_fab_lang', lang);
        
        this.updateUI();
        this.changeLanguage(lang);

        // Dispatch Events (Isolated) - After changeLanguage ensures doc.lang is updated
        document.dispatchEvent(new CustomEvent('fabCurrencyChanged', { detail: curr }));
        document.dispatchEvent(new CustomEvent('fabLanguageChanged', { detail: lang }));
    },

    addToWishlist(item) {
        const index = this.wishlist.findIndex(i => i.id === item.id);
        if (index === -1) {
            this.wishlist.push(item);
        } else {
            this.wishlist.splice(index, 1);
        }
        localStorage.setItem('jeju_wishlist', JSON.stringify(this.wishlist));
        this.updateBadge();
        
        // Dispatch event for other components to update their UI (e.g. fill hearts)
        document.dispatchEvent(new CustomEvent('fabWishlistUpdated', { detail: this.wishlist }));
    },

    removeFromWishlist(id) {
        this.wishlist = this.wishlist.filter(item => item.id !== id);
        localStorage.setItem('jeju_wishlist', JSON.stringify(this.wishlist));
        this.updateBadge();
        document.dispatchEvent(new CustomEvent('fabWishlistUpdated', { detail: this.wishlist }));
        
        // Re-render preview if open
        const modal = document.getElementById('wishlistLayer');
        if (modal && modal.style.display !== 'none') {
            renderWishlistPreview();
        }
    },

    isInWishlist(id) {
        return this.wishlist.some(item => item.id === id);
    },

    updateBadge() {
        const badge = document.getElementById('fabWishlistCount');
        if (badge) badge.textContent = this.wishlist.length;
    },

    updateUI() {
        // Update Button Label
        const btnText = document.querySelector('#fabCurrency .card-label');
        if (btnText) {
             btnText.textContent = this.currency === 'KRW' ? 'KOR' : 'ENG';
        }

        const rate = 1300;
        const symbol = this.currency === 'KRW' ? '₩' : '$';
        
        // Update Prices
        document.querySelectorAll('[data-price-krw]').forEach(el => {
            const krw = parseInt(el.getAttribute('data-price-krw'));
            if (!isNaN(krw)) {
                let displayPrice = this.currency === 'KRW' ? 
                    krw.toLocaleString() : 
                    Math.round(krw / rate).toLocaleString();
                el.textContent = `${symbol}${displayPrice}`;
            }
        });
    },

    changeLanguage(lang) {
        if (typeof langData === 'undefined') return;

        // Update Text Content
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.dataset.lang;
            if (langData[lang] && langData[lang][key] !== undefined) {
                 if (el.innerHTML.includes('<') && el.innerHTML.includes('>')) {
                    el.innerHTML = langData[lang][key];
                 } else {
                    el.textContent = langData[lang][key];
                 }
            }
        });

        // Update Placeholders
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.dataset.langPlaceholder;
            if (langData[lang] && langData[lang][key] !== undefined) {
                el.placeholder = langData[lang][key];
            }
        });

        document.documentElement.lang = lang;
    }
};

/* HTML Template - Card Key Structure */
const fabHTML = `
<div class="fab-wrapper" id="fabSystem">
    <!-- Layers -->
    <!-- Shared Element Target: Wishlist Window -->
    <div class="wishlist-window" id="wishlistLayer">
        <div class="wishlist-header">
            <h3>MY STAY PICK</h3>
            <button class="close-wishlist">×</button>
        </div>
        <div class="wishlist-content" id="wishlistContent"></div>
    </div>

    <!-- Card Holder (Trigger) -->
    <div class="card-holder" id="fabHolder">
        <div class="fab-peek"></div>
        <div class="fab-body"></div>
    </div>

    <!-- Cards Container -->
    <div class="fab-cards-container">
        <!-- Card 0: Home (New Leftmost) -->
        <div class="fab-card card-0" id="fabHome">
            <i data-lucide="home" class="card-icon"></i>
            <span class="card-label">HOME</span>
        </div>
        <!-- Card 1: Top -->
        <div class="fab-card card-1" id="fabTop">
            <i data-lucide="arrow-up" class="card-icon"></i>
            <span class="card-label">TOP</span>
        </div>
        <!-- Card 2: Currency/Language Toggle -->
        <div class="fab-card card-2" id="fabCurrency">
            <i data-lucide="globe" class="card-icon"></i>
            <span class="card-label">KOR</span>
        </div>
        <!-- Card 3: Wishlist -->
        <div class="fab-card card-3" id="fabWishlist">
            <i data-lucide="heart" class="card-icon"></i>
            <span class="card-label">PICK</span>
            <span class="fab-badge" id="fabWishlistCount">0</span>
        </div>
        <!-- Card 4: Chatbot (Rightmost) -->
        <div class="fab-card card-4" id="fabChatbot">
            <i data-lucide="message-circle" class="card-icon"></i>
            <span class="card-label">CHAT</span>
        </div>
    </div>
</div>
`;

let isFabOpen = false;
let isAnimating = false;

function initFAB() {
    // 1. Inject HTML
    document.body.insertAdjacentHTML('beforeend', fabHTML);
    
    // Move Wishlist Popup to Body (Fix Stacking Context)
    const popup = document.getElementById('wishlistLayer');
    if (popup) document.body.appendChild(popup);
    
    // 2. Icons
    if (window.lucide) lucide.createIcons();

    // 3. Selection
    const holder = document.getElementById('fabHolder');
    const cards = document.querySelectorAll('.fab-card');
    
    // 4. GSAP Timeline Logic
    holder.addEventListener('click', toggleFabAnimation);

    // 5. Card Actions
    document.getElementById('fabHome').addEventListener('click', () => {
        window.location.href = '/index.html';
    });
    
    document.getElementById('fabTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Modified Logic: Toggle Both Currency and Language
    document.getElementById('fabCurrency').addEventListener('click', () => {
        const nextCurr = FABState.currency === 'KRW' ? 'USD' : 'KRW';
        const nextLang = FABState.language === 'ko' ? 'en' : 'ko';
        FABState.setCurrencyAndLang(nextCurr, nextLang);
    });

    document.getElementById('fabWishlist').addEventListener('click', (e) => {
        // Shared Element Transition Logic
        
        // 1. Get Trigger Position
        // Note: card is transformed by GSAP, getBoundingClientRect accounts for that
        const card = document.getElementById('fabWishlist');
        const rect = card.getBoundingClientRect();
        
        // 2. Prepare Modal
        const modal = document.getElementById('wishlistLayer');
        const overlay = document.querySelector('.modal-overlay') || createOverlay();
        
        // Initial State (Match Card)
        modal.style.top = `${rect.top}px`;
        modal.style.left = `${rect.left}px`;
        modal.style.width = `${rect.width}px`;
        modal.style.height = `${rect.height}px`;
        modal.style.display = 'flex';
        modal.style.transform = 'none'; // Reset any prior transforms
        
        // Render content
        renderWishlistPreview();
        
        // 3. Play Animation (Force Reflow / Next Frame)
        requestAnimationFrame(() => {
            modal.classList.add('is-active');
            overlay.classList.add('active');
        });
    });

    // Close Logic
    const closeModal = () => {
        const modal = document.getElementById('wishlistLayer');
        const overlay = document.querySelector('.modal-overlay');
        
        if (!modal) return;

        modal.classList.remove('is-active');
        if (overlay) overlay.classList.remove('active');
        
        // Wait for transition then hide
        setTimeout(() => {
             modal.style.display = 'none';
        }, 500); // Match CSS transition duration
    };

    document.querySelectorAll('.close-wishlist').forEach(btn => btn.addEventListener('click', closeModal));
    
    // Create Overlay helper
    function createOverlay() {
        const ov = document.createElement('div');
        ov.className = 'modal-overlay';
        document.body.appendChild(ov);
        ov.addEventListener('click', closeModal);
        return ov;
    }

    document.getElementById('fabChatbot').addEventListener('click', () => {
        if (window.hotelChatbot) {
             const card = document.getElementById('fabChatbot');
             const rect = card.getBoundingClientRect();
             window.hotelChatbot.openChatbot(rect);
        }
    });

    // Initial State
    FABState.updateBadge();
    FABState.updateUI(); // Initial Update
    
    // Add Hover Animations (GSAP)
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (isFabOpen) {
                gsap.to(card, { y: -110, duration: 0.3, ease: "power2.out", overwrite: "auto" });
            }
        });
        card.addEventListener('mouseleave', () => {
            if (isFabOpen) {
                gsap.to(card, { y: -100, duration: 0.3, ease: "power2.out", overwrite: "auto" });
            }
        });
    });
}

function toggleFabAnimation() {
    if (!window.gsap) {
        console.error('GSAP not loaded');
        return;
    }

    const tl = gsap.timeline();
    const c0 = '.card-0'; // HOME
    const c1 = '.card-1';
    const c2 = '.card-2';
    const c3 = '.card-3';
    const c4 = '.card-4';
    const holder = '#fabHolder';

    // Cooldown Check
    if (isAnimating) return;
    isAnimating = true;
    setTimeout(() => { isAnimating = false; }, 1600);

    if (!isFabOpen) {
        // [Phase A: Opening]
        // Reset visibility (in case CSS hidden them) & Enable Clicks
        gsap.set([c0, c1, c2, c3, c4], { opacity: 1, pointerEvents: "auto" });
        
        // Stage 1: Eject Up (All cards)
        // From Y=20 (Hidden) to Y=-100 (Higher rise)
        tl.fromTo([c0, c1, c2, c3, c4], 
            { y: 20, opacity: 0 },
            { y: -100, opacity: 1, duration: 0.6, ease: "power3.out" }
        )
        
        // Step 2: Slide C0 to Left (Most left)
        // Positions: C4(0), C3(-75), C2(-150), C1(-225), C0(-300)
          .to(c0, { x: -300, duration: 1.0, ease: "elastic.out(1.2, 0.5)" })
        
        // Step 3: Fan out others
          .to(c1, { x: -225, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.85")
          .to(c2, { x: -150, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.9")
          .to(c3, { x: -75, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.9")
          .to(c4, { x: 0, duration: 1.0, ease: "elastic.out(1.2, 0.5)" }, "-=0.9");
          
        gsap.to(holder, { y: 5, opacity: 0.9, duration: 0.3 }); // Slight dip

    } else {
        // [Phase B: Closing]
        // Disable Clicks Immediately
        gsap.set([c0, c1, c2, c3, c4], { pointerEvents: "none" });

        // Stage 1: Stack & Hide
        
        // Collapse X
        tl.to(c0, { x: -225, duration: 0.15, ease: "power2.in" }) // Synced inwards
          .to([c0, c1], { x: -150, duration: 0.15, ease: "power2.in" })
          .to([c0, c1, c2], { x: -75, duration: 0.15, ease: "power2.in" })
          .to([c0, c1, c2, c3], { x: 0, duration: 0.15, ease: "power2.in" })
        
        // Stage 2: Tuck In (Y=20, Opacity 0)
          .to([c0, c1, c2, c3, c4], { y: 20, opacity: 0, duration: 0.3, ease: "power3.in" });
          
        gsap.to(holder, { y: 0, opacity: 1, duration: 0.3 }); // Restore holder
    }

    isFabOpen = !isFabOpen;
}

function layerToggle(id) {
    // legacy support if needed
}

function renderWishlistPreview() {
    const el = document.getElementById('wishlistContent');
    if(!el) return;

    if (FABState.wishlist.length === 0) {
        el.innerHTML = `
            <div class="wishlist-empty">
                <i data-lucide="heart-off" style="width: 48px; height: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                <p>저장된 숙소가 없습니다.</p>
                <button class="btn-explore" onclick="document.querySelector('.close-wishlist').click()">숙소 둘러보기</button>
            </div>
        `;
        if(window.lucide) lucide.createIcons();
        return;
    }

    el.innerHTML = FABState.wishlist.map(item => `
        <div class="wishlist-item-card">
            <img src="${item.image}" alt="${item.name}" class="wishlist-thumb">
            <div class="wishlist-info">
                <div class="wishlist-top">
                    <span class="wishlist-location">${item.location.split('·')[0]}</span>
                    <button class="wishlist-remove" onclick="FABState.removeFromWishlist(${item.id})">
                        <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                    </button>
                </div>
                <h4 class="wishlist-title">${item.name}</h4>
                <div class="wishlist-price">
                    ${item.price}
                </div>
            </div>
        </div>
    `).join('');
    
    if(window.lucide) lucide.createIcons();
}

function toggleLayer(id) {
    const layer = document.getElementById(id);
    if(layer) layer.classList.toggle('active');
}

// Auto Init
document.addEventListener('DOMContentLoaded', initFAB);

// Expose to Global
window.FABState = FABState;
