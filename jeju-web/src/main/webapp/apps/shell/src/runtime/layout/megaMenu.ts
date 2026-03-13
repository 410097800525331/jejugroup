let megaScrollBound = false;
let megaCloseTimer: number | null = null;
let activeMegaItem: HTMLElement | null = null;
let activeMegaDropdown: HTMLElement | null = null;

const syncHeaderScrolledClass = () => {
  const header =
    document.getElementById("header") ||
    document.querySelector<HTMLElement>(".hotel-shell-header") ||
    document.querySelector<HTMLElement>(".header");
  if (!header) {
    return;
  }

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
    return;
  }

  header.classList.remove("scrolled");
};

const bindScrollEffect = () => {
  if (megaScrollBound) {
    return;
  }

  megaScrollBound = true;
  window.addEventListener("scroll", syncHeaderScrolledClass);
  syncHeaderScrolledClass();
};

const clearMegaCloseTimer = () => {
  if (megaCloseTimer !== null) {
    window.clearTimeout(megaCloseTimer);
    megaCloseTimer = null;
  }
};

const closeMegaDropdown = (item: HTMLElement, dropdown: HTMLElement) => {
  dropdown.classList.remove("active");

  if (activeMegaItem === item) {
    activeMegaItem = null;
  }

  if (activeMegaDropdown === dropdown) {
    activeMegaDropdown = null;
  }
};

const openMegaDropdown = (item: HTMLElement, dropdown: HTMLElement) => {
  clearMegaCloseTimer();

  if (activeMegaDropdown && activeMegaDropdown !== dropdown && activeMegaItem) {
    closeMegaDropdown(activeMegaItem, activeMegaDropdown);
  }

  dropdown.classList.add("active");
  activeMegaItem = item;
  activeMegaDropdown = dropdown;
};

const scheduleMegaClose = (item: HTMLElement, dropdown: HTMLElement) => {
  clearMegaCloseTimer();

  megaCloseTimer = window.setTimeout(() => {
    if (item.matches(":hover") || dropdown.matches(":hover")) {
      return;
    }

    closeMegaDropdown(item, dropdown);
  }, 120);
};

const bindDropdownHover = () => {
  const navItems = document.querySelectorAll<HTMLElement>(".hotel-shell-nav-item");
  navItems.forEach((item) => {
    if (item.dataset.megaHoverBound === "true") {
      return;
    }

    const dropdown = item.querySelector<HTMLElement>(".hotel-shell-mega-dropdown");
    if (!dropdown) {
      return;
    }

    item.dataset.megaHoverBound = "true";

    item.addEventListener("mouseenter", () => {
      openMegaDropdown(item, dropdown);
    });

    item.addEventListener("mouseleave", () => {
      scheduleMegaClose(item, dropdown);
    });

    dropdown.addEventListener("mouseenter", () => {
      openMegaDropdown(item, dropdown);
    });

    dropdown.addEventListener("mouseleave", () => {
      scheduleMegaClose(item, dropdown);
    });
  });
};

const bindPreviewHover = () => {
  const megaMenuItems = document.querySelectorAll<HTMLElement>(".hotel-shell-mega-menu-item");
  megaMenuItems.forEach((menuItem) => {
    if (menuItem.dataset.previewHoverBound === "true") {
      return;
    }

    menuItem.dataset.previewHoverBound = "true";

    menuItem.addEventListener("mouseenter", () => {
      const dropdown = menuItem.closest<HTMLElement>(".hotel-shell-mega-dropdown");
      const targetId = menuItem.getAttribute("data-preview");
      const targetImage = targetId ? document.getElementById(targetId) : null;

      if (!dropdown || !targetImage) {
        return;
      }

      dropdown.querySelectorAll<HTMLElement>(".hotel-shell-preview-image").forEach((image) => {
        image.classList.remove("active");
      });

      targetImage.classList.add("active");

      const loader = dropdown.querySelector<HTMLElement>(".hotel-shell-preview-loader");
      if (loader) {
        loader.style.display = "none";
      }
    });
  });
};

const initInitialPreviewImage = () => {
  document.querySelectorAll<HTMLElement>(".hotel-shell-mega-dropdown").forEach((dropdown) => {
    if (dropdown.dataset.previewInit === "true") {
      return;
    }

    dropdown.dataset.previewInit = "true";

    const firstImage = dropdown.querySelector<HTMLElement>(".hotel-shell-preview-image");
    if (firstImage) {
      firstImage.classList.add("active");
    }
  });
};

export const initMegaMenu = () => {
  bindScrollEffect();
  bindDropdownHover();
  bindPreviewHover();
  initInitialPreviewImage();
};
