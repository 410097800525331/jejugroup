const searchInput = document.getElementById("esim-search-input");
const searchButton = document.getElementById("esim-search-button");
const countryCards = Array.from(document.querySelectorAll("#esim-country-grid .country-card"));
const emptyState = document.getElementById("esim-empty-state");
const accordionButtons = Array.from(document.querySelectorAll(".accordion-button"));
const faqButtons = Array.from(document.querySelectorAll(".faq-button"));

if (!searchInput || !searchButton || !emptyState) {
    throw new Error("[jeju-spring] esim page bootstrap failed");
}

searchButton.addEventListener("click", filterCountries);
searchInput.addEventListener("input", filterCountries);

accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.parentElement.classList.toggle("active");
    });
});

faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.parentElement.classList.toggle("active");
    });
});

function filterCountries() {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    countryCards.forEach((card) => {
        const haystack = card.dataset.search || "";
        const visible = !keyword || haystack.includes(keyword);
        card.hidden = !visible;
        if (visible) {
            visibleCount += 1;
        }
    });

    emptyState.hidden = visibleCount > 0;
}
