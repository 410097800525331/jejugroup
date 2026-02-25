document.addEventListener("DOMContentLoaded", () => {
  const mainTabButtons = Array.from(document.querySelectorAll(".tab-nav-btn"));
  const mainTabPanes = Array.from(document.querySelectorAll(".tab-pane"));

  const activateMainTab = (tabId) => {
    if (!tabId) return;

    mainTabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tabId);
    });

    mainTabPanes.forEach((pane) => {
      pane.classList.toggle("active", pane.id === tabId);
    });
  };

  mainTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateMainTab(button.dataset.tab);
    });
  });

  const initialMainTab =
    mainTabButtons.find((button) => button.classList.contains("active"))?.dataset.tab ||
    mainTabButtons[0]?.dataset.tab;
  activateMainTab(initialMainTab);

  const serviceButtons = Array.from(document.querySelectorAll(".service-tab-btn"));
  const reservationGroups = Array.from(document.querySelectorAll(".reservation-group"));

  const filterReservations = (service) => {
    serviceButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.service === service);
    });

    reservationGroups.forEach((group) => {
      const visible = service === "all" || group.dataset.service === service;
      group.classList.toggle("active", visible);
    });
  };

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterReservations(button.dataset.service);
    });
  });

  const initialService =
    serviceButtons.find((button) => button.classList.contains("active"))?.dataset.service || "all";
  filterReservations(initialService);

  const couponButtons = Array.from(document.querySelectorAll(".coupon-tab-btn"));
  const couponItems = Array.from(document.querySelectorAll(".coupon-item"));

  const filterCoupons = (couponType) => {
    couponButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.couponTab === couponType);
    });

    couponItems.forEach((item) => {
      const visible = couponType === "all" || item.classList.contains(couponType);
      item.style.display = visible ? "" : "none";
    });
  };

  couponButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterCoupons(button.dataset.couponTab);
    });
  });

  const initialCoupon =
    couponButtons.find((button) => button.classList.contains("active"))?.dataset.couponTab || "all";
  filterCoupons(initialCoupon);

  const detailModal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  const modalClose = detailModal?.querySelector(".modal-close");
  const detailButtons = Array.from(document.querySelectorAll(".btn-detail"));

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const closeModal = () => {
    if (detailModal) {
      detailModal.style.display = "none";
    }
  };

  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!detailModal || !modalBody) return;

      const card = button.closest(".booking-card");
      if (!card) return;

      const title = card.querySelector(".booking-title h4")?.textContent?.trim() || "";
      const date = card.querySelector(".booking-date")?.textContent?.trim() || "";
      const details = Array.from(card.querySelectorAll(".booking-details p"))
        .map((line) => line.textContent?.trim())
        .filter(Boolean);

      const detailLines = details.map((line) => `<li>${escapeHtml(line)}</li>`).join("");

      modalBody.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(date)}</p>
        <ul>${detailLines}</ul>
      `;

      detailModal.style.display = "block";
    });
  });

  modalClose?.addEventListener("click", closeModal);

  if (detailModal) {
    window.addEventListener("click", (event) => {
      if (event.target === detailModal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});
