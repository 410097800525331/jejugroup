/* ==================== 풀페이지 스크롤 제어 ==================== */
let currentSectionIndex = 0;
let isScrolling = false;
let keyPressed = {};
let keyTimeout;
let wheelTimeout;
let lastWheelTime = 0;

const sections = document.querySelectorAll('.section');
const keyDelay = 50;
const wheelDelay = 30;
const scrollDuration = 1200;

/* ==================== 스크롤 함수 ==================== */
function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;
    
    currentSectionIndex = index;
    isScrolling = true;
    
    const targetSection = sections[currentSectionIndex];
    const targetPosition = targetSection.offsetTop;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        isScrolling = false;
    }, scrollDuration);
}

/* ==================== 마우스 휠 이벤트 ==================== */
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime < wheelDelay) return;
    lastWheelTime = now;
    
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            scrollToSection(currentSectionIndex + 1);
        } else {
            scrollToSection(currentSectionIndex - 1);
        }
    }, wheelDelay);
}, { passive: false });

/* ==================== 키보드 이벤트 처리 ==================== */
document.addEventListener('keydown', (e) => {
    if (keyPressed[e.key]) return;
    keyPressed[e.key] = true;
    
    clearTimeout(keyTimeout);
    keyTimeout = setTimeout(() => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            scrollToSection(currentSectionIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollToSection(currentSectionIndex - 1);
        } else if (e.key === 'PageDown') {
            e.preventDefault();
            scrollToSection(currentSectionIndex + 1);
        } else if (e.key === 'PageUp') {
            e.preventDefault();
            scrollToSection(currentSectionIndex - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            scrollToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            scrollToSection(sections.length - 1);
        }
    }, keyDelay);
});

document.addEventListener('keyup', (e) => {
    keyPressed[e.key] = false;
});

/* ==================== 현재 섹션 감지 및 헤더 제어 ==================== */
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            currentSectionIndex = index;
        }
    });
    
    // 헤더 스타일 제어
    const header = document.querySelector('.header');
    
    if (currentSectionIndex === 0) {
        // 섹션 1: 헤더 흰색 배경 + 글자 흰색
        header.classList.remove('transparent');
        header.classList.add('section1-header');
        header.classList.remove('section2plus-header');
    } else {
        // 섹션 2-5: 헤더 투명 배경 + 글자 검은색
        header.classList.add('transparent');
        header.classList.remove('section1-header');
        header.classList.add('section2plus-header');
    }
    
    // 탑 버튼 표시/숨김
    const topBtn = document.getElementById('topBtn');
    if (window.scrollY > window.innerHeight / 2) {
        topBtn.classList.add('show');
    } else {
        topBtn.classList.remove('show');
    }
});

/* ==================== 탑 버튼 기능 ==================== */
const topBtn = document.getElementById('topBtn');
topBtn.addEventListener('click', () => {
    scrollToSection(0);
});

/* ==================== 언어 버튼 기능 ==================== */
const langToggle = document.querySelector('.lang-toggle');
let isKorean = true;

langToggle.addEventListener('click', () => {
    isKorean = !isKorean;
    langToggle.textContent = isKorean ? '한국어' : 'English';
});

/* ==================== 네비게이션 링크 클릭 ==================== */
document.querySelectorAll('.gnb-link').forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href');
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            const sectionIndex = Array.from(sections).indexOf(targetSection);
            scrollToSection(sectionIndex);
        }
    });
});

/* ==================== CTA 버튼 클릭 이벤트 ==================== */
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        alert('예약 페이지로 이동합니다.');
    });
});

/* ==================== 멤버십 버튼 클릭 이벤트 ==================== */
const membershipBtn = document.querySelector('.membership-btn');
if (membershipBtn) {
    membershipBtn.addEventListener('click', () => {
        alert('멤버십 가입 페이지로 이동합니다.');
    });
}

/* ==================== 페이지 로드 시 초기화 ==================== */
window.addEventListener('load', () => {
    currentSectionIndex = 0;
    scrollToSection(0);
});
