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
  private cssReady: Promise<void> | null = null;

  private waitForNextFrame() {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  private ensureCss(cssHref: string) {
    if (this.cssReady) {
      return this.cssReady;
    }

    this.cssReady = new Promise<void>((resolve) => {
      const existingLink = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).find(
        (link) => link.href === cssHref,
      );

      if (existingLink) {
        if (existingLink.sheet) {
          resolve();
          return;
        }

        existingLink.addEventListener("load", () => resolve(), { once: true });
        existingLink.addEventListener("error", () => resolve(), { once: true });
        return;
      }

      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = cssHref;
      cssLink.addEventListener("load", () => resolve(), { once: true });
      cssLink.addEventListener("error", () => resolve(), { once: true });
      document.head.appendChild(cssLink);
    });

    return this.cssReady;
  }

  private async ensureMarkup() {
    if (this.isInitialized) {
      return;
    }

    const cssHref = new URL("components/react/ui/reservationDrawer/drawer.css", resolveFromAppRoot("./")).href;
    await this.ensureCss(cssHref);

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
    await this.waitForNextFrame();
    await this.waitForNextFrame();

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
