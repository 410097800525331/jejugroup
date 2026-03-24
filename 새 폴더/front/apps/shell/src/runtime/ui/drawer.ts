import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { ReservationDrawerMarkup } from "@front-components/ui/reservationDrawer";
import { resolveFromAppRoot } from "@runtime/utils/appRoot";

class ReservationDrawer {
  private isInitialized = false;
  private isOpen = false;
  private root: Root | null = null;
  private backdrop: HTMLElement | null = null;
  private panel: HTMLElement | null = null;
  private closeButton: HTMLElement | null = null;

  private async ensureMarkup() {
    if (this.isInitialized) {
      return;
    }

    const cssHref = new URL("components/react/ui/reservationDrawer/drawer.css", resolveFromAppRoot("./")).href;
    const styleExists = Array.from(document.querySelectorAll("link")).some((link) => link.href === cssHref);
    if (!styleExists) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = cssHref;
      document.head.appendChild(cssLink);
    }

    let container = document.getElementById("reservation-drawer-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "reservation-drawer-container";
      document.body.appendChild(container);
    }

    if (!this.root) {
      this.root = createRoot(container);
    }

    this.root.render(createElement(ReservationDrawerMarkup));
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    this.backdrop = document.getElementById("resDrawerBackdrop");
    this.panel = document.getElementById("resDrawerPanel");
    this.closeButton = document.getElementById("resDrawerClose");

    this.bindEvents();
    this.isInitialized = true;
  }

  private bindEvents() {
    if (!this.backdrop || !this.panel || !this.closeButton) {
      return;
    }

    this.closeButton.addEventListener("click", () => this.close());
    this.backdrop.addEventListener("click", () => this.close());

    window.addEventListener("popstate", (event) => {
      const state = event.state as { modal?: string } | null;
      if (this.isOpen && state?.modal !== "reservation") {
        this.close(true);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    const form = document.getElementById("resDrawerForm") as HTMLFormElement | null;
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("예약 API 연동 전 임시 폼 상태");
      });
    }

    this.panel.addEventListener("click", (event) => {
      const routeElement = (event.target as HTMLElement | null)?.closest("[data-route]");
      if (routeElement) {
        this.close();
      }
    });
  }

  async open() {
    await this.ensureMarkup();
    if (this.isOpen || !this.backdrop || !this.panel) {
      return;
    }

    this.isOpen = true;
    history.pushState({ modal: "reservation" }, "", "#reservation");
    this.backdrop.offsetHeight;

    requestAnimationFrame(() => {
      this.backdrop?.classList.add("active");
      this.panel?.classList.add("active");
    });

    document.body.style.overflow = "hidden";
  }

  close(fromPopState = false) {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.backdrop?.classList.remove("active");
    this.panel?.classList.remove("active");
    document.body.style.overflow = "";

    if (!fromPopState && history.state?.modal === "reservation") {
      history.back();
    }
  }
}

export const reservationDrawer = new ReservationDrawer();
