document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Parallax Effect
    const heroBg = document.getElementById('hero-bg');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Booking Widget Logic
    
    // Tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Date Picker Popup
    const dateTrigger = document.getElementById('date-picker-trigger');
    const datePopup = document.getElementById('date-popup');
    const dateDisplay = document.getElementById('date-display');
    const dateConfirm = document.getElementById('date-confirm');
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');

    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => {
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const formatDateInput = (date) => {
        return date.toISOString().split('T')[0];
    };

    checkIn.value = formatDateInput(today);
    checkOut.value = formatDateInput(tomorrow);
    dateDisplay.textContent = `${formatDate(today)} - ${formatDate(tomorrow)}`;

    dateTrigger.addEventListener('click', (e) => {
        if (!e.target.closest('.date-popup')) {
            datePopup.classList.toggle('active');
            guestPopup.classList.remove('active');
        }
    });

    dateConfirm.addEventListener('click', (e) => {
        e.stopPropagation();
        const start = new Date(checkIn.value);
        const end = new Date(checkOut.value);
        dateDisplay.textContent = `${formatDate(start)} - ${formatDate(end)}`;
        datePopup.classList.remove('active');
    });

    // Guest Picker Popup
    const guestTrigger = document.getElementById('guest-picker-trigger');
    const guestPopup = document.getElementById('guest-popup');
    const guestDisplay = document.getElementById('guest-display');
    const guestCountSpan = document.getElementById('guest-count');
    const roomCountSpan = document.getElementById('room-count');

    let guests = 2;
    let rooms = 1;

    guestTrigger.addEventListener('click', (e) => {
        if (!e.target.closest('.guest-popup')) {
            guestPopup.classList.toggle('active');
            datePopup.classList.remove('active');
        }
    });

    window.updateGuests = (change) => {
        const newGuests = guests + change;
        if (newGuests >= 1) {
            guests = newGuests;
            guestCountSpan.textContent = guests;
            updateGuestDisplay();
        }
    };

    window.updateRooms = (change) => {
        const newRooms = rooms + change;
        if (newRooms >= 1) {
            rooms = newRooms;
            roomCountSpan.textContent = rooms;
            updateGuestDisplay();
        }
    };

    function updateGuestDisplay() {
        guestDisplay.textContent = `성인 ${guests}명, 객실 ${rooms}개`;
    }

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (!dateTrigger.contains(e.target)) {
            datePopup.classList.remove('active');
        }
        if (!guestTrigger.contains(e.target)) {
            guestPopup.classList.remove('active');
        }
    });

    // Initialize Lucide Icons
    lucide.createIcons();
});
