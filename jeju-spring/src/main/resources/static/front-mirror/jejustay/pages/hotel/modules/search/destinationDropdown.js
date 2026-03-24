export const initDestinationDropdown = ({ closeAllPopups }) => {
  const destinationField = document.getElementById("destinationFieldLarge");
  const destinationInput = document.getElementById("destinationInput");
  const destinationDropdown = document.getElementById("destinationDropdown");

  if (!destinationField || !destinationDropdown) {
    return;
  }

  destinationField.addEventListener("click", (event) => {
    event.stopPropagation();

    const isActive = destinationDropdown.classList.contains("active");
    closeAllPopups("destinationDropdown");

    destinationDropdown.classList.toggle("active", !isActive);
  });

  if (destinationInput) {
    destinationInput.addEventListener("click", (event) => {
      event.stopPropagation();

      if (destinationDropdown.classList.contains("active")) {
        return;
      }

      closeAllPopups("destinationDropdown");
      destinationDropdown.classList.add("active");
    });
  }

  document.querySelectorAll(".destination-item, .destination-item-text").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();

      if (destinationInput && item.dataset.value) {
        destinationInput.value = item.dataset.value;
      }

      destinationDropdown.classList.remove("active");
    });
  });

  destinationDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });
};
