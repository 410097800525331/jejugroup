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
    // 인덱스 범위 제한 (0 ~ 마지막 섹션)
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    if (isScrolling) return;
    
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

/* ==================== 키보드 이벤트 제어 (수정본) ==================== */
document.addEventListener('keydown', (e) => {
    // 이미 스크롤 중이면 키 입력을 무시
    if (isScrolling) {
        // 스크롤 중일 때 방향키/스페이스바 기본 동작(수치 스크롤)을 완전히 차단
        if (['ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
            e.preventDefault();
        }
        return;
    }

    // 처리할 키 목록
    const scrollKeys = ['ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', 'End'];
    
    if (scrollKeys.includes(e.key)) {
        e.preventDefault(); // 브라우저 기본 스크롤 방지

        if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
            // 마지막 섹션이 아닐 때만 이동
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            // 첫 번째 섹션이 아닐 때만 이동
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        } else if (e.key === 'Home') {
            scrollToSection(0);
        } else if (e.key === 'End') {
            scrollToSection(sections.length - 1);
        }
    }
}, { passive: false }); // passive: false를 설정해야 preventDefault가 확실히 작동합니다.

/* ==================== 현재 섹션 감지 및 헤더 제어 (수정본) ==================== */
window.addEventListener('scroll', () => {
    // 1. 자동 스크롤 중에는 인덱스를 수동으로 계산하지 않음 (충돌 방지)
    if (isScrolling) {
        updateHeaderAndButtons(); // 헤더 스타일만 업데이트
        return;
    }

    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    
    // 2. 페이지 최하단(푸터)에 도달했는지 확인
    if (window.scrollY + windowHeight >= fullHeight - 10) {
        currentSectionIndex = sections.length - 1;
    } else {
        sections.forEach((section, index) => {
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                currentSectionIndex = index;
            }
        });
    }
    
    updateHeaderAndButtons();
});
    
    function updateHeaderAndButtons() {
    // 헤더 스타일 제어
    const header = document.querySelector('.header');
    
    if (currentSectionIndex === 0) {
        header.classList.remove('transparent');
        header.classList.add('section1-header');
        header.classList.remove('section2plus-header');
    } else {
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
}

/* ==================== 탑 버튼 기능 ==================== */
const topBtn = document.getElementById('topBtn');
topBtn.addEventListener('click', () => {
    scrollToSection(0);
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

// ==================== ✨ 언어 토글 기능 (오류 수정 완료) ✨ =================
// =======================================================================

const langData = {
    ko: {
        pageTitle: "제주 그룹 - 제주의 모든 여행을 함께",
        login: "로그인",
        signup: "회원가입",
        customerCenter: "고객센터",
        navAir: "제주에어",
        navHotel: "제주호텔",
        navRentCar: "제주렌트카",
        navMembership: "멤버십",
        langToggle: "English",
        heroTitle: "제주 여행의 시작과 끝, 제주 그룹이 함께합니다.",
        heroSubtitle: "하늘, 머물음, 그리고 드라이브. 제주의 모든 여행을 한 곳에서.",
        scrollDown: "Scroll Down",
        airTag: "제주에어",
        airTitle: "가장 빠르고 편안한 하늘길",
        airDesc: "제주에어는 합리적인 운임으로 최고의 서비스를 제공합니다. 국내외 주요 노선을 운항하며, 편안한 객실 환경과 친절한 승무원 서비스로 당신의 여행을 더욱 특별하게 만들어드립니다.",
        airFeature1: "합리적인 운임",
        airFeature2: "편안한 객실",
        airFeature3: "친절한 서비스",
        airButton: "항공권 예약하기",
        hotelTag: "제주호텔",
        hotelTitle: "자연을 품은 프리미엄 휴식처",
        hotelDesc: "제주호텔은 아름다운 자연 속에서 프리미엄한 휴식을 제공합니다. 현대적인 시설과 전통의 따뜻함이 어우러진 객실에서 잊을 수 없는 밤을 경험하세요.",
        hotelFeature1: "프리미엄 객실",
        hotelFeature2: "자연 친화적 설계",
        hotelFeature3: "최고의 서비스",
        hotelButton: "객실 둘러보기",
        rentCarTag: "제주렌트카",
        rentCarTitle: "완벽한 드라이빙을 위한 최신형 차량",
        rentCarDesc: "제주렌트카는 최신형 차량으로 완벽한 드라이빙 경험을 제공합니다. 여행지의 도로를 자유롭게 누비며, 당신만의 특별한 여행을 만들어보세요. 24시간 고객지원으로 안전한 여행을 보장합니다.",
        rentCarFeature1: "최신형 차량",
        rentCarFeature2: "합리적인 가격",
        rentCarFeature3: "24시간 지원",
        rentCarButton: "차량 예약하기",
        membershipTitle: "멤버십",
        membershipSubtitle: "제주 여행의 모든 순간을 더욱 특별하게",
        membershipNotice1: "모든 멤버십은 언제든지 취소할 수 있습니다.",
        membershipNotice2: "추가 혜택과 이벤트는 <strong>제주 그룹 앱</strong>에서 확인하세요.",
        appStrong: "제주 그룹 앱",
        silverTitle: "실버 멤버",
        silverPrice: "월 <span>29,900</span>원",
        joinButton: "가입하기",
        silverBenefit1: "✓ 항공권 5% 할인",
        silverBenefit2: "✓ 호텔 예약 10% 할인",
        silverBenefit3: "✓ 렌트카 기본료 할인",
        silverBenefit4: "✓ 우선 고객 지원",
        popular: "인기",
        goldTitle: "골드 멤버",
        goldPrice: "월 <span>49,900</span>원",
        goldBenefit1: "✓ 항공권 10% 할인",
        goldBenefit2: "✓ 호텔 예약 15% 할인",
        goldBenefit3: "✓ 렌트카 기본료 20% 할인",
        goldBenefit4: "✓ 무료 공항 라운지",
        goldBenefit5: "✓ 우선 예약 서비스",
        platinumTitle: "플래티넘 멤버",
        platinumPrice: "월 <span>79,900</span>원",
        platinumBenefit1: "✓ 항공권 15% 할인",
        platinumBenefit2: "✓ 호텔 예약 20% 할인",
        platinumBenefit3: "✓ 렌트카 기본료 30% 할인",
        platinumBenefit4: "✓ VIP 라운지 이용",
        platinumBenefit5: "✓ 전담 컨시어지 서비스",
        platinumBenefit6: "✓ 무료 취소 정책",
        footerCompany: "<strong>(주)제주 그룹</strong>",
        footerCEO: "대표이사: 김이배",
        footerBizNum: "사업자등록번호: 616-81-50527",
        footerSaleNum: "통신판매업신고: 제주 2006-125호",
        footerHosting: "호스팅 사업자: AWS",
        footerAddr: "주소: 제주특별자치도 제주시 신대로 64 (연동, 건설공제회관 3층)",
        footerCs: "고객센터: 1599-1500 (09:00 ~ 19:00)",
        footerCsEmail: "고객 문의: jejugroup.help@jejugroup.net",
        footerPartnerEmail: "제휴 문의: partnership@jejugroup.net",
        footerCopyright: "Copyright ⓒ Jeju Group. All Rights Reserved."
    },
    en: {
        pageTitle: "Jeju Group - All Your Jeju Travel Together",
        login: "Login",
        signup: "Sign Up",
        customerCenter: "Support",
        navAir: "Jeju Air",
        navHotel: "Jeju Hotel",
        navRentCar: "Jeju Rent-a-Car",
        navMembership: "Membership",
        langToggle: "한국어",
        heroTitle: "From Start to Finish, Jeju Group is With You.",
        heroSubtitle: "Sky, stay, and drive. All your Jeju travel in one place.",
        scrollDown: "Scroll Down",
        airTag: "Jeju Air",
        airTitle: "The Fastest, Most Comfortable Skyway",
        airDesc: "Jeju Air offers top-tier service at reasonable fares. We operate major domestic and international routes, making your journey special with a comfortable cabin and friendly crew.",
        airFeature1: "Reasonable Fares",
        airFeature2: "Comfortable Cabins",
        airFeature3: "Friendly Service",
        airButton: "Book a Flight",
        hotelTag: "Jeju Hotel",
        hotelTitle: "Premium Relaxation in Nature's Embrace",
        hotelDesc: "Jeju Hotel provides a premium retreat in beautiful nature. Experience an unforgettable night in rooms where modern facilities meet traditional warmth.",
        hotelFeature1: "Premium Rooms",
        hotelFeature2: "Eco-Friendly Design",
        hotelFeature3: "Top-Notch Service",
        hotelButton: "Explore Rooms",
        rentCarTag: "Jeju Rent-a-Car",
        rentCarTitle: "Latest Vehicles for a Perfect Drive",
        rentCarDesc: "Jeju Rent-a-Car offers a perfect driving experience with the latest vehicles. Freely explore your destination's roads and create your own special trip. We ensure a safe journey with 24-hour customer support.",
        rentCarFeature1: "Latest Models",
        rentCarFeature2: "Affordable Prices",
        rentCarFeature3: "24-Hour Support",
        rentCarButton: "Reserve a Car",
        membershipTitle: "Membership",
        membershipSubtitle: "Make every moment of your Jeju trip more special",
        membershipNotice1: "All memberships can be canceled at any time.",
        membershipNotice2: "Check the <strong>Jeju Group App</strong> for additional benefits and events.",
        appStrong: "Jeju Group App",
        silverTitle: "Silver Member",
        silverPrice: "<span>$29.99</span>/month",
        joinButton: "Sign Up",
        silverBenefit1: "✓ 5% off flights",
        silverBenefit2: "✓ 10% off hotel bookings",
        silverBenefit3: "✓ Discount on rental car fees",
        silverBenefit4: "✓ Priority customer support",
        popular: "Best",
        goldTitle: "Gold Member",
        goldPrice: "<span>$49.99</span>/month",
        goldBenefit1: "✓ 10% off flights",
        goldBenefit2: "✓ 15% off hotel bookings",
        goldBenefit3: "✓ 20% off rental car fees",
        goldBenefit4: "✓ Free airport lounge access",
        goldBenefit5: "✓ Priority booking service",
        platinumTitle: "Platinum Member",
        platinumPrice: "<span>$79.99</span>/month",
        platinumBenefit1: "✓ 15% off flights",
        platinumBenefit2: "✓ 20% off hotel bookings",
        platinumBenefit3: "✓ 30% off rental car fees",
        platinumBenefit4: "✓ VIP lounge access",
        platinumBenefit5: "✓ Dedicated concierge service",
        platinumBenefit6: "✓ Free cancellation policy",
        footerCompany: "<strong>Jeju Group Inc.</strong>",
        footerCEO: "CEO: Kim Lee-bae",
        footerBizNum: "Business Registration No: 616-81-50527",
        footerSaleNum: "E-commerce Permit: Jeju 2006-125",
        footerHosting: "Hosting Provider: AWS",
        footerAddr: "Address: 3F, 64 Sindae-ro, Jeju-si, Jeju-do, Republic of Korea",
        footerCs: "Customer Service: 1599-1500 (09:00 ~ 19:00)",
        footerCsEmail: "Support: jejugroup.help@jejugroup.net",
        footerPartnerEmail: "Partnerships: partnership@jejugroup.net",
        footerCopyright: "Copyright ⓒ Jeju Group. All Rights Reserved."
    }
};

const changeLanguage = (lang) => {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (langData[lang] && langData[lang][key] !== undefined) {
            el.innerHTML = langData[lang][key];
        }
    });
    document.documentElement.lang = lang;
};

const langToggleButton = document.querySelector('.lang-toggle');
let currentLang = 'ko';

langToggleButton.addEventListener('click', () => {
    currentLang = (currentLang === 'ko') ? 'en' : 'ko';
    langToggleButton.textContent = langData[currentLang].langToggle;
    changeLanguage(currentLang);
});

document.addEventListener('DOMContentLoaded', () => {
    // 페이지가 처음 로드될 때 기본 언어(한국어)로 텍스트를 설정합니다.
    changeLanguage(currentLang);
});