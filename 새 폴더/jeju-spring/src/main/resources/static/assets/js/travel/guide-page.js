const searchInput = document.getElementById("guide-search-input");
const searchButton = document.getElementById("guide-search-button");
const cards = Array.from(document.querySelectorAll("#guide-country-grid .country-card"));
const emptyState = document.getElementById("guide-empty-state");

if (!searchInput || !searchButton || !emptyState) {
    throw new Error("[jeju-spring] guide page bootstrap failed");
}

searchButton.addEventListener("click", applyFilter);
searchInput.addEventListener("input", applyFilter);

function applyFilter() {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
        const visible = !keyword || (card.dataset.search || "").includes(keyword);
        card.hidden = !visible;
        if (visible) {
            visibleCount += 1;
        }
    });

    emptyState.hidden = visibleCount > 0;
}
