import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import {
  ReservationDrawerMarkup,
  type ReservationDrawerLookupResult,
} from "@front-components/ui/reservationDrawer";
import { resolveFromAppRoot } from "@runtime/utils/appRoot";

type ReservationDrawerLookupStatus = "idle" | "loading" | "success" | "error";

interface ReservationDrawerSubmitPayload {
  reservationNo: string;
  email: string;
}

class ReservationDrawer {
  private isInitialized = false;
  private isOpen = false;
  private root: Root | null = null;
  private cssReady: Promise<void> | null = null;
  private lookupStatus: ReservationDrawerLookupStatus = "idle";
  private lookupMessage = "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다.";
  private lookupResult: ReservationDrawerLookupResult | null = null;
  private submittedEmail = "";
  private requestSerial = 0;
  private activeRequestSerial = 0;

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.isOpen) {
      this.close();
    }
  };

  private readonly handlePopState = (event: PopStateEvent) => {
    const state = event.state as { modal?: string } | null;
    if (this.isOpen && state?.modal !== "reservation") {
      this.close(true);
    }
  };

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

  private render() {
    if (!this.root) {
      return;
    }

    this.root.render(
      createElement(ReservationDrawerMarkup, {
        isOpen: this.isOpen,
        status: this.lookupStatus,
        message: this.lookupMessage,
        result: this.lookupResult,
        submittedEmail: this.submittedEmail,
        onSubmit: (payload: ReservationDrawerSubmitPayload) => {
          void this.submitLookup(payload);
        },
        onClose: () => this.close(),
        onReset: () => this.resetLookupState(),
      }),
    );
  }

  private resetLookupState() {
    this.lookupStatus = "idle";
    this.lookupMessage = "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다.";
    this.lookupResult = null;
    this.render();
  }

  private setError(message: string) {
    this.lookupStatus = "error";
    this.lookupMessage = message;
    this.lookupResult = null;
    this.render();
  }

  private setLoading() {
    this.lookupStatus = "loading";
    this.lookupMessage = "예약 정보를 확인하고 있습니다. 잠시만 기다려 주세요.";
    this.lookupResult = null;
    this.render();
  }

  private setSuccess(result: ReservationDrawerLookupResult) {
    this.lookupStatus = "success";
    this.lookupMessage = "예약 정보를 확인했습니다.";
    this.lookupResult = result;
    this.render();
  }

  private async submitLookup(payload: ReservationDrawerSubmitPayload) {
    const reservationNo = payload.reservationNo.trim();
    const email = payload.email.trim();

    if (!reservationNo || !email) {
      this.setError("예약 번호와 이메일을 모두 입력해 주세요.");
      return;
    }

    const requestSerial = ++this.requestSerial;
    this.activeRequestSerial = requestSerial;
    this.submittedEmail = email;
    this.setLoading();

    try {
      const response = await fetch("/api/booking/guest-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          reservationNo,
          email,
        }),
      });

      const payload = await this.readJson(response);
      if (requestSerial !== this.activeRequestSerial) {
        return;
      }

      if (!response.ok || payload?.success === false) {
        throw new Error(this.extractErrorMessage(payload) || "예약 정보를 찾지 못했습니다.");
      }

      this.setSuccess(this.normalizeLookupResult(this.asRecord(payload?.data ?? payload), reservationNo, email));
    } catch (error) {
      if (requestSerial !== this.activeRequestSerial) {
        return;
      }

      const message = error instanceof Error && error.message ? error.message : "예약 정보를 확인하지 못했습니다. 입력값을 다시 확인해 주세요.";
      this.setError(message);
    }
  }

  private async readJson(response: Response): Promise<Record<string, unknown> | null> {
    const text = await response.text();
    if (!text.trim()) {
      return null;
    }

    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private extractErrorMessage(payload: Record<string, unknown> | null) {
    if (!payload) {
      return "";
    }

    const message = payload.message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }

    return "";
  }

  private asRecord(value: unknown) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }

    return {};
  }

  private normalizeLookupResult(
    source: Record<string, unknown>,
    reservationNo: string,
    email: string,
  ): ReservationDrawerLookupResult {
    const bookingNo = this.firstText(source, [
      "bookingNo",
      "reservationNo",
      "booking_no",
      "reservation_no",
      "id",
    ]);
    const destination = this.firstText(source, ["destination", "destinationName", "travelDestination", "area"]);
    const travelDate = this.firstDateText(source, ["travelDate", "travel_date", "serviceStartDate", "service_start_date"]);
    const amount = this.formatAmount(this.firstValue(source, ["amount", "totalAmount", "total_amount", "paidAmount", "paid_amount"]));
    const memberBooking = this.firstBoolean(source, ["memberBooking", "member_booking", "isMember", "is_member"]);
    const lastName = this.firstText(source, ["lastName", "last_name", "passengerLastName", "passenger_last_name", "bookerLastName", "booker_last_name"]);
    const firstName = this.firstText(source, ["firstName", "first_name", "passengerFirstName", "passenger_first_name", "bookerFirstName", "booker_first_name"]);
    const normalizedReservationNo = this.firstText(source, ["reservationNo", "reservation_no", "bookingNo", "booking_no"]) || reservationNo;
    const normalizedEmail = this.firstText(source, ["email", "reservationEmail", "reservation_email"]) || email;

    return {
      bookingNo,
      reservationNo: normalizedReservationNo,
      destination,
      travelDate,
      amount,
      memberBooking,
      lastName,
      firstName,
      email: normalizedEmail,
    };
  }

  private firstText(source: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }

      if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
      }
    }

    return "";
  }

  private firstValue(source: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null) {
        return value;
      }
    }

    return null;
  }

  private firstBoolean(source: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "boolean") {
        return value;
      }

      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true") {
          return true;
        }
        if (normalized === "false") {
          return false;
        }
        if (normalized === "1" || normalized === "y" || normalized === "yes" || normalized === "member") {
          return true;
        }
        if (normalized === "0" || normalized === "n" || normalized === "no" || normalized === "guest") {
          return false;
        }
      }
    }

    return undefined;
  }

  private firstDateText(source: Record<string, unknown>, keys: string[]) {
    const value = this.firstText(source, keys);
    if (!value) {
      return "";
    }

    const normalized = value.replace(/\//g, "-").trim();
    return normalized.length >= 8 ? normalized : value;
  }

  private formatAmount(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(value);
    }

    if (typeof value === "string" && value.trim()) {
      const normalized = value.trim();
      if (/^\d+(\.\d+)?$/.test(normalized)) {
        const numeric = Number(normalized);
        if (Number.isFinite(numeric)) {
          return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
            maximumFractionDigits: 0,
          }).format(numeric);
        }
      }

      return normalized;
    }

    return "";
  }

  private attachGlobalListeners() {
    window.addEventListener("popstate", this.handlePopState);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  async ensureMarkup() {
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

    this.attachGlobalListeners();
    this.render();
    await this.waitForNextFrame();
    this.isInitialized = true;
  }

  async open() {
    await this.ensureMarkup();
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    history.pushState({ modal: "reservation" }, "", "#reservation");
    document.body.style.overflow = "hidden";
    this.render();
  }

  close(fromPopState = false) {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.activeRequestSerial = 0;
    document.body.style.overflow = "";
    this.resetLookupState();

    if (!fromPopState && history.state?.modal === "reservation") {
      history.back();
    }

    this.render();
  }
}

export const reservationDrawer = new ReservationDrawer();
