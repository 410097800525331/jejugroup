/* ==================== 풀페이지 스크롤 기능 (마우스 휠 제어) ==================== */
const sections = document.querySelectorAll('.section');
let currentSectionIndex = 0;
let isScrolling = false;
const scrollDuration = 1200; // 스크롤 애니메이션 시간 (ms) - 더 부드럽게

// 특정 섹션으로 스크롤
function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;
    
    isScrolling = true;
    currentSectionIndex = index;
    
    const targetSection = sections[index];
    const targetPosition = targetSection.offsetTop;
    
    // 부드러운 스크롤 애니메이션
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // 스크롤 완료 후 플래그 해제
    setTimeout(() => {
        isScrolling = false;
    }, scrollDuration);
}

/* ==================== 키보드 디바운싱 ==================== */
let keyTimeout;
const keyDelay = 50; // 키보드 디바운싱 시간 (ms)

/* ==================== 키보드 이벤트 처리 (방향키, 스페이스바) ==================== */
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    clearTimeout(keyTimeout);
    
    keyTimeout = setTimeout(() => {
    
        // 아래 방향키 또는 스페이스바
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            scrollToSection(currentSectionIndex + 1);
        }
        // 위 방향키
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollToSection(currentSectionIndex - 1);
        }
        // Page Down
        else if (e.key === 'PageDown') {
            e.preventDefault();
            scrollToSection(currentSectionIndex + 1);
        }
        // Page Up
        else if (e.key === 'PageUp') {
            e.preventDefault();
            scrollToSection(currentSectionIndex - 1);
        }
        // Home 키
        else if (e.key === 'Home') {
            e.preventDefault();
            scrollToSection(0);
        }
        // End 키
        else if (e.key === 'End') {
            e.preventDefault();
            scrollToSection(sections.length - 1);
        }
    }, keyDelay);
});



/* ==================== 마우스 휠 디바운싱 ==================== */
let wheelTimeout;
const wheelDelay = 50; // 마우스 휠 디바운싱 시간 (ms)

document.addEventListener('wheel', (e) => {
    // 풀페이지 스크롤을 구현할 때는 브라우저 기본 스크롤을 명시적으로 막음
    e.preventDefault();
    
    if (isScrolling) return;
    
    clearTimeout(wheelTimeout);
    
    wheelTimeout = setTimeout(() => {
        // 스크롤 방향 감지
        if (e.deltaY > 0) {
            // 아래로 스크롤
            scrollToSection(currentSectionIndex + 1);
        } else if (e.deltaY < 0) {
            // 위로 스크롤
            scrollToSection(currentSectionIndex - 1);
        }
    }, wheelDelay);
}, { passive: false });

// 현재 섹션 인덱스 업데이트 (스크롤 위치 기반)
window.addEventListener('scroll', () => {
    let newIndex = 0;
    
    sections.forEach((section, index) => {
        if (window.scrollY >= section.offsetTop - window.innerHeight / 2) {
            newIndex = index;
        }
    });
    
    currentSectionIndex = newIndex;
});

/* ==================== 헤더 투명도 제어 ==================== */
const header = document.querySelector('.header');
const headerUtil = document.querySelector('.header-util');

window.addEventListener('scroll', () => {
    let currentIndex = 0;
    
    sections.forEach((section, index) => {
        if (window.scrollY >= section.offsetTop - window.innerHeight / 2) {
            currentIndex = index;
        }
    });
    
    // 첫 번째 섹션(index 0)에서만 헤더가 흰색, header-util 보임
    if (currentIndex === 0) {
        header.classList.remove('transparent');
        headerUtil.classList.remove('hidden');
    } else {
        header.classList.add('transparent');
        headerUtil.classList.add('hidden');
    }
});

/* ==================== 예약 탭 전환 ==================== */
const bookingTabs = document.querySelectorAll('.booking-tab');
const bookingTabContents = document.querySelectorAll('.booking-tab-content');

bookingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 모든 탭 비활성화
        bookingTabs.forEach(t => t.classList.remove('active'));
        bookingTabContents.forEach(content => content.classList.remove('active'));
        
        // 클릭한 탭 활성화
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

/* ==================== 편의 탭 전환 ==================== */
const convTabs = document.querySelectorAll('.conv-tab');
const convItems = document.querySelectorAll('.conv-item');

convTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 모든 탭 비활성화
        convTabs.forEach(t => t.classList.remove('active'));
        convItems.forEach(item => item.classList.remove('active'));
        
        // 클릭한 탭 활성화
        tab.classList.add('active');
        const convId = tab.getAttribute('data-conv');
        document.getElementById(convId).classList.add('active');
    });
});

/* ==================== 캐러셀 기능 ==================== */
class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.container = carouselElement.querySelector('.carousel-container');
        this.items = carouselElement.querySelector('.carousel-items');
        this.prevBtn = carouselElement.querySelector('.carousel-btn.prev');
        this.nextBtn = carouselElement.querySelector('.carousel-btn.next');
        this.dotsContainer = carouselElement.parentElement.querySelector('.carousel-dots');
        this.dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.dot') : [];
        
        this.currentIndex = 0;
        this.itemWidth = 0;
        this.gap = 20;
        
        this.init();
    }
    
    init() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        
        if (this.dots && this.dots.length > 0) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        this.updateCarousel();
        window.addEventListener('resize', () => this.updateCarousel());
    }
    
    updateCarousel() {
        const cards = this.items.querySelectorAll('.benefit-card, .route-card');
        if (cards.length === 0) return;
        
        this.itemWidth = cards[0].offsetWidth;
        this.scroll();
    }
    
    scroll() {
        const offset = -(this.currentIndex * (this.itemWidth + this.gap));
        this.items.style.transform = `translateX(${offset}px)`;
        this.items.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        this.updateDots();
    }
    
    prev() {
        const cards = this.items.querySelectorAll('.benefit-card, .route-card');
        const maxIndex = Math.max(0, cards.length - this.getVisibleCards());
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scroll();
        }
    }
    
    next() {
        const cards = this.items.querySelectorAll('.benefit-card, .route-card');
        const visibleCards = this.getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        
        // 마지막 카드 바로 전 카드에서 멈춤
        if (this.currentIndex < maxIndex - 1) {
            this.currentIndex++;
            this.scroll();
        }
    }
    
    getVisibleCards() {
        // 한 번에 보이는 카드 개수 계산
        if (!this.container) return 1;
        const containerWidth = this.container.offsetWidth;
        const cardWidth = this.itemWidth + this.gap;
        return Math.floor(containerWidth / cardWidth);
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.scroll();
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// 캐러셀 초기화
const carousels = document.querySelectorAll('.benefit-carousel, .route-carousel');
carousels.forEach(carousel => {
    new Carousel(carousel);
});

/* ==================== 네비게이션 호버 시 헤더 배경 흰색 ==================== */
const gnb = document.querySelector('#gnb');
gnb.addEventListener('mouseenter', () => {
    if (header.classList.contains('transparent')) {
        header.classList.remove('transparent');
    }
});

gnb.addEventListener('mouseleave', () => {
    let currentIndex = 0;
    
    sections.forEach((section, index) => {
        if (window.scrollY >= section.offsetTop - window.innerHeight / 2) {
            currentIndex = index;
        }
    });
    
    if (currentIndex !== 0) {
        header.classList.add('transparent');
    }
});

/* ==================== 언어 전환 버튼 ==================== */
const langToggle = document.querySelector('.lang-toggle');

langToggle.addEventListener('click', () => {
    const currentLang = langToggle.textContent.trim();
    if (currentLang === 'English') {
        langToggle.textContent = '한국어';
    } else {
        langToggle.textContent = 'English';
    }
});

/* ==================== 탑 버튼 ==================== */
const topBtn = document.querySelector('.top-btn');

// 스크롤 위치에 따라 탑 버튼 표시/숨김
window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight / 2) {
        topBtn.classList.add('show');
    } else {
        topBtn.classList.remove('show');
    }
});

// 탑 버튼 클릭 시 페이지 맨 위로 이동
topBtn.addEventListener('click', () => {
    scrollToSection(0);
});
