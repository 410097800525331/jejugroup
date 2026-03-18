import { initMegaMenu } from "@runtime/layout/megaMenu";
import { initStaggerNav } from "@runtime/layout/stagger";
import { canUseAdminSurface } from "@front-core-auth/local_admin.js";
import { logoutSession, resolveSession } from "@front-core-auth/session_manager.js";

const SESSION_STORAGE_KEY = "userSession";
const SESSION_UPDATE_EVENT = "jeju:session-updated";

let headerScrollBound = false;
let headerAuthSyncQueued = false;

const getCurrentHeader = () => {
  return (
    document.getElementById("header") ||
    document.querySelector<HTMLElement>(".hotel-shell-header") ||
    document.querySelector<HTMLElement>(".header")
  );
};

const syncHeaderScrollState = () => {
  const header = getCurrentHeader();
  if (!header) {
    return;
  }

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
    return;
  }

  header.classList.remove("scrolled");
};

const bindHeaderScroll = () => {
  if (headerScrollBound) {
    syncHeaderScrollState();
    return;
  }

  headerScrollBound = true;
  window.addEventListener("scroll", syncHeaderScrollState);
  syncHeaderScrollState();
};

const bindMegaPreview = () => {
  const megaItems = document.querySelectorAll<HTMLElement>(".hotel-shell-mega-menu-item");
  megaItems.forEach((item) => {
    if (item.dataset.previewBound === "true") {
      return;
    }

    item.dataset.previewBound = "true";
    item.addEventListener("mouseenter", () => {
      const previewId = item.dataset.preview;
      const parentDropdown = item.closest<HTMLElement>(".hotel-shell-mega-dropdown");
      if (!previewId || !parentDropdown) {
        return;
      }

      const previewArea = parentDropdown.querySelector<HTMLElement>(".hotel-shell-mega-menu-preview");
      if (!previewArea) {
        return;
      }

      previewArea.querySelectorAll<HTMLElement>(".hotel-shell-preview-image").forEach((image) => {
        image.classList.toggle("active", image.id === previewId);
      });
    });
  });
};

const bindMobileMenuToggle = () => {
  const mobileMenuButton = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (!mobileMenuButton || !mobileNav) {
    return;
  }

  if (mobileMenuButton.dataset.mobileToggleBound === "true") {
    return;
  }

  mobileMenuButton.dataset.mobileToggleBound = "true";
  mobileMenuButton.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });
};

const getLoginButton = () => {
  return document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn");
};

const hydrateLucideIcons = (attempt = 0) => {
  const lucide = (window as { lucide?: { createIcons?: () => void } }).lucide;
  if (lucide?.createIcons) {
    lucide.createIcons();
    return;
  }

  if (attempt >= 30) {
    return;
  }

  window.setTimeout(() => {
    hydrateLucideIcons(attempt + 1);
  }, 100);
};

const updateLoginButtonAsLogout = async (loginButton: HTMLElement & { href?: string }) => {
  const span = loginButton.querySelector("span");
  if (span) {
    span.textContent = "로그아웃";
  } else {
    loginButton.textContent = "로그아웃";
  }

  if ("href" in loginButton) {
    loginButton.href = "#";
  }

  loginButton.removeAttribute("data-route");

  if (loginButton.dataset.logoutBound === "true") {
    return;
  }

  loginButton.dataset.logoutBound = "true";
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await logoutSession();
    } catch (_error) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }

    window.location.reload();
  });
};

const appendIndexAdminLink = (headerUtil: HTMLElement) => {
  if (headerUtil.querySelector('[data-route="ADMIN.DASHBOARD"]')) {
    return;
  }

  const adminLink = document.createElement("a");
  adminLink.id = "indexAdminBtn";
  adminLink.href = "#";
  adminLink.className = "util-link route-link";
  adminLink.setAttribute("data-route", "ADMIN.DASHBOARD");
  adminLink.style.color = "#FF5000";
  adminLink.style.fontWeight = "700";
  adminLink.textContent = "관리자 페이지";

  const divider = document.createElement("span");
  divider.className = "util-divider";
  divider.textContent = "|";

  headerUtil.prepend(adminLink, divider);
};

const resolveSessionData = async () => {
  try {
    return await resolveSession();
  } catch (_error) {
  }

  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch (_error) {
    return null;
  }
};

const canOpenAdmin = async () => {
  try {
    return canUseAdminSurface();
  } catch (_error) {
    return false;
  }
};

const syncHeaderAuthState = async () => {
  const adminButton = document.getElementById("headerAdminBtn");
  const loginButton = getLoginButton() as (HTMLElement & { href?: string }) | null;
  const indexHeaderUtil = document.getElementById("index-header-util");

  const [sessionData, localAdmin] = await Promise.all([resolveSessionData(), canOpenAdmin()]);

  if (sessionData && loginButton) {
    await updateLoginButtonAsLogout(loginButton);
  }

  if (localAdmin && adminButton) {
    adminButton.style.display = "flex";
  }

  if (localAdmin && indexHeaderUtil) {
    appendIndexAdminLink(indexHeaderUtil);
  }

  hydrateLucideIcons();
};

const queueHeaderAuthSync = () => {
  if (headerAuthSyncQueued) {
    return;
  }

  headerAuthSyncQueued = true;
  setTimeout(async () => {
    headerAuthSyncQueued = false;
    await syncHeaderAuthState();
  }, 0);
};

export const initHeader = (attempt = 0) => {
  const header = getCurrentHeader();
  if (!header) {
    if (attempt < 20) {
      window.setTimeout(() => {
        initHeader(attempt + 1);
      }, 50);
    }
    return;
  }

  bindHeaderScroll();
  bindMegaPreview();
  bindMobileMenuToggle();
  initMegaMenu();
  initStaggerNav();
  queueHeaderAuthSync();
};

export const bindHeaderGlobalEvents = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    initHeader();
  });

  window.addEventListener("storage", (event) => {
    if (event.key === SESSION_STORAGE_KEY) {
      queueHeaderAuthSync();
    }
  });

  window.addEventListener(SESSION_UPDATE_EVENT, () => {
    queueHeaderAuthSync();
  });
};
