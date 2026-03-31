const getCounterValue = (elementId, fallbackValue) => {
  const value = parseInt(document.getElementById(elementId)?.textContent || String(fallbackValue), 10);
  return Number.isNaN(value) ? fallbackValue : value;
};

const updateGuestSummary = () => {
  const guestSummary = document.getElementById("guestSummary");
  if (!guestSummary) {
    return;
  }

  const rooms = getCounterValue("roomsCountLarge", 1);
  const adults = getCounterValue("adultsCountLarge", 1);
  const children = getCounterValue("childrenCountLarge", 0);

  const parts = [`성인 ${adults}명`, `객실 ${rooms}개`];
  if (children > 0) {
    parts.push(`아동 ${children}명`);
  }

  guestSummary.textContent = parts.join(", ");
};

export const initGuestSelector = ({ closeAllPopups }) => {
  const guestField = document.getElementById("guestFieldLarge");
  const guestPopup = document.getElementById("guestPopupLarge");

  if (!guestField || !guestPopup) {
    return;
  }

  guestField.addEventListener("click", (event) => {
    event.stopPropagation();

    const isActive = guestPopup.classList.contains("active");
    closeAllPopups("guestPopupLarge");
    guestPopup.classList.toggle("active", !isActive);
  });

  guestPopup.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.querySelectorAll(".counter-btn-new").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const targetKey = button.dataset.target;
      if (!targetKey) {
        return;
      }

      const counterValue = document.getElementById(`${targetKey}CountLarge`);
      if (!counterValue) {
        return;
      }

      const minValueMap = {
        rooms: 1,
        adults: 1,
        children: 0
      };

      const currentValue = parseInt(counterValue.textContent || "0", 10);
      if (button.classList.contains("plus")) {
        counterValue.textContent = String(currentValue + 1);
      } else if (currentValue > minValueMap[targetKey]) {
        counterValue.textContent = String(currentValue - 1);
      }

      updateGuestSummary();
    });
  });

  updateGuestSummary();
};
