const root = document.getElementById("travel-activities-page");

if (!root) {
    throw new Error("[jeju-spring] travel activities page bootstrap failed");
}

const searchInput = document.getElementById("activity-search-input");
const searchButton = document.getElementById("activity-search-button");
const filterButtons = Array.from(root.querySelectorAll(".filter-chip"));
const cards = Array.from(root.querySelectorAll(".activity-card"));
const emptyState = document.getElementById("activity-empty-state");
const authModal = document.getElementById("activities-auth-modal");
const openAuthButton = document.getElementById("activities-auth-button");
const closeAuthButton = document.getElementById("activities-close-modal");
const authForm = document.getElementById("activities-auth-form");
const authResult = document.getElementById("activities-auth-result");

if (!searchInput || !searchButton || !emptyState || !authModal || !openAuthButton || !closeAuthButton || !authForm || !authResult) {
    throw new Error("[jeju-spring] travel activities required elements missing");
}

let selectedCategory = "all";

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category || "all";
        filterButtons.forEach((chip) => chip.classList.toggle("active", chip === button));
        applyFilters();
    });
});

searchButton.addEventListener("click", applyFilters);
searchInput.addEventListener("input", () => {
    applyFilters();
});

cards.forEach((card) => {
    const wishlistButton = card.querySelector(".wishlist-btn");
    if (wishlistButton) {
        wishlistButton.addEventListener("click", (event) => {
            event.preventDefault();
            wishlistButton.classList.toggle("active");
        });
    }
});

openAuthButton.addEventListener("click", () => {
    authModal.hidden = false;
});

closeAuthButton.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (event) => {
    if (event.target === authModal) {
        closeAuthModal();
    }
});

authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const bookingCode = document.getElementById("activities-booking-code").value.trim();
    const flightDate = document.getElementById("activities-flight-date").value;

    if (!bookingCode || !flightDate) {
        authResult.hidden = false;
        authResult.textContent = "예약번호와 탑승일을 먼저 입력해라.";
        return;
    }

    authResult.hidden = false;
    authResult.textContent = "탑승객 인증 상태를 확인했다. 실제 자동 할인 연결은 다음 슬라이스에서 붙인다.";
});

applyFilters();

function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
        const category = card.dataset.category || "";
        const search = card.dataset.search || "";
        const categoryMatched = selectedCategory === "all" || category === selectedCategory;
        const keywordMatched = !keyword || search.includes(keyword);
        const visible = categoryMatched && keywordMatched;

        card.hidden = !visible;
        if (visible) {
            visibleCount += 1;
        }
    });

    emptyState.hidden = visibleCount > 0;
}

function closeAuthModal() {
    authModal.hidden = true;
}
