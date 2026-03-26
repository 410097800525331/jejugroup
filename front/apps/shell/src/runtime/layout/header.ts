import { initMegaMenu } from "@runtime/layout/megaMenu";
import { initStaggerNav } from "@runtime/layout/stagger";
import { hasAdminAccess } from "@front-core-auth/local_admin.js";
import { logoutSession, resolveSession } from "@front-core-auth/session_manager.js";
import { resolveRoute } from "@front-core-utils/path_resolver.js";

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

const resolveLoginRouteParams = (loginButton: HTMLElement) => {
  const rawRouteParams = loginButton.getAttribute("data-route-params");
  if (rawRouteParams) {
    try {
      const parsedRouteParams = JSON.parse(rawRouteParams) as { shell?: unknown };
      if (typeof parsedRouteParams.shell === "string" && parsedRouteParams.shell.trim() !== "") {
        return { shell: parsedRouteParams.shell.trim() };
      }
    } catch (_error) {
    }
  }

  return {
    shell: loginButton.id === "headerLoginBtn" ? "stay" : "main",
  };
};

const getHotelAuthUtilityButton = () => {
  return document.getElementById("headerAuthActionBtn");
};

const getIndexReservationCheckButton = () => {
  return document.getElementById("indexReservationCheckBtn");
};

const getIndexReservationCheckDivider = () => {
  const reservationButton = getIndexReservationCheckButton();
  const divider = reservationButton?.previousElementSibling;

  return divider instanceof HTMLElement && divider.classList.contains("util-divider")
    ? divider
    : null;
};

const getDocumentLanguage = () => {
  return (
    document.documentElement.getAttribute("lang") ||
    document.documentElement.lang ||
    "ko"
  )
    .trim()
    .toLowerCase();
};

const getLocalizedHotelAuthLabel = (utilityButton: HTMLElement, isSignedIn: boolean) => {
  const label = utilityButton.querySelector<HTMLElement>("[data-auth-label]");
  if (!label) {
    return null;
  }

  const lang = getDocumentLanguage();
  const isKorean = lang.startsWith("ko");

  if (isSignedIn) {
    if (!isKorean) {
      return label.dataset.authMemberLabelEn || label.dataset.authMemberLabelKo || "My Page";
    }

    return label.dataset.authMemberLabelKo || label.dataset.authMemberLabelEn || "마이페이지";
  }

  if (!isKorean) {
    return label.dataset.authLabelEn || label.dataset.authLabelKo || "Guest Reservation Check";
  }

  return label.dataset.authLabelKo || label.dataset.authLabelEn || "비회원 예약확인";
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

const updateLoginButtonAsLogin = (loginButton: HTMLElement & { href?: string }) => {
  if (loginButton.dataset.logoutBound === "true") {
    const replacement = loginButton.cloneNode(true) as HTMLElement & { href?: string };
    replacement.removeAttribute("data-logout-bound");
    loginButton.replaceWith(replacement);
    loginButton = replacement;
  }

  const span = loginButton.querySelector("span");
  if (span) {
    span.textContent = "로그인";
  } else {
    loginButton.textContent = "로그인";
  }

  const loginRouteParams = resolveLoginRouteParams(loginButton);

  if ("href" in loginButton) {
    loginButton.href = resolveRoute("AUTH.LOGIN", loginRouteParams);
  }

  loginButton.setAttribute("data-route", "AUTH.LOGIN");
  loginButton.setAttribute("data-route-params", JSON.stringify(loginRouteParams));
  loginButton.removeAttribute("data-logout-bound");
};

const updateHotelAuthUtilityButton = (utilityButton: HTMLElement, isSignedIn: boolean) => {
  const guestIcon = utilityButton.querySelector<HTMLElement>('[data-auth-icon="guest"]');
  const memberIcon = utilityButton.querySelector<HTMLElement>('[data-auth-icon="member"]');
  const label = utilityButton.querySelector<HTMLElement>("[data-auth-label]");
  const localizedLabel = getLocalizedHotelAuthLabel(utilityButton, isSignedIn);

  if (isSignedIn) {
    utilityButton.removeAttribute("data-action");
    utilityButton.setAttribute("data-route", "MYPAGE.DASHBOARD");
    utilityButton.setAttribute("data-route-params", '{"shell":"stay"}');
    utilityButton.setAttribute("href", resolveRoute("MYPAGE.DASHBOARD", { shell: "stay" }));

    if (guestIcon) {
      guestIcon.hidden = true;
    }

    if (memberIcon) {
      memberIcon.hidden = false;
    }

    if (label) {
      label.textContent = localizedLabel ?? "마이페이지";
    }
    return;
  }

  utilityButton.setAttribute("data-action", "OPEN_RESERVATION_DRAWER");
  utilityButton.removeAttribute("data-route");
  utilityButton.removeAttribute("data-route-params");
  utilityButton.setAttribute("href", resolveRoute("SERVICES.AIR.BOOKING.GUEST_RESERVATION"));

  if (guestIcon) {
    guestIcon.hidden = false;
  }

  if (memberIcon) {
    memberIcon.hidden = true;
  }

  if (label) {
    label.textContent = localizedLabel ?? "비회원 예약확인";
  }
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

const removeIndexAdminLink = (headerUtil: HTMLElement) => {
  const adminLink = headerUtil.querySelector<HTMLElement>("#indexAdminBtn");
  if (!adminLink) {
    return;
  }

  const divider = adminLink.nextElementSibling;
  adminLink.remove();

  if (divider instanceof HTMLElement && divider.classList.contains("util-divider")) {
    divider.remove();
  }
};

const resolveSessionData = async () => {
  try {
    return await resolveSession();
  } catch (_error) {
    return null;
  }
};

const syncHeaderAuthState = async (attempt = 0) => {
  const adminButton = document.getElementById("headerAdminBtn");
  const loginButton = getLoginButton() as (HTMLElement & { href?: string }) | null;
  const utilityButton = getHotelAuthUtilityButton();
  const indexReservationCheckButton = getIndexReservationCheckButton();
  const indexHeaderUtil = document.getElementById("index-header-util");

  const sessionData = await resolveSessionData();
  const isSignedIn = Boolean(sessionData);
  const canShowAdmin = hasAdminAccess(sessionData);

  if (loginButton) {
    if (isSignedIn) {
      await updateLoginButtonAsLogout(loginButton);
    } else {
      updateLoginButtonAsLogin(loginButton);
    }
  }

  if (utilityButton) {
    updateHotelAuthUtilityButton(utilityButton, isSignedIn);
  }

  if (indexReservationCheckButton) {
    indexReservationCheckButton.hidden = isSignedIn;
  }

  const indexReservationCheckDivider = getIndexReservationCheckDivider();
  if (indexReservationCheckDivider) {
    indexReservationCheckDivider.hidden = isSignedIn;
  }

  if (adminButton) {
    adminButton.style.display = canShowAdmin ? "flex" : "none";
  }

  if (indexHeaderUtil) {
    if (canShowAdmin) {
      appendIndexAdminLink(indexHeaderUtil);
    } else {
      removeIndexAdminLink(indexHeaderUtil);
    }
  } else if (canShowAdmin && loginButton?.id === "indexLoginBtn" && attempt < 5) {
    queueHeaderAuthSync(attempt + 1);
    return;
  }

  hydrateLucideIcons();
};

export const queueHeaderAuthSync = (attempt = 0) => {
  if (headerAuthSyncQueued) {
    return;
  }

  headerAuthSyncQueued = true;
  setTimeout(async () => {
    headerAuthSyncQueued = false;
    await syncHeaderAuthState(attempt);
  }, 0);
};

export const bindHeaderStructure = (attempt = 0) => {
  const header = getCurrentHeader();
  if (!header) {
    if (attempt < 20) {
      window.setTimeout(() => {
        bindHeaderStructure(attempt + 1);
      }, 50);
    }
    return;
  }

  bindHeaderScroll();
  bindMegaPreview();
  bindMobileMenuToggle();
  initMegaMenu();
  initStaggerNav();
};

export const initHeader = (attempt = 0) => {
  bindHeaderStructure(attempt);
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
