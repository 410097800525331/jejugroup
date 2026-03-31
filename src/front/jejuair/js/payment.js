document.addEventListener("DOMContentLoaded", () => {
  const paymentContainer = document.getElementById("paymentContainer");
  const paymentSuccess = document.getElementById("paymentSuccess");
  const payButton = document.getElementById("payButton");
  const successConfirmBtn = document.getElementById("successConfirmBtn");
  const backBtn = document.getElementById("backBtn");

  const methodInputs = Array.from(document.querySelectorAll("input[name='paymentMethod']"));
  const methodItems = Array.from(document.querySelectorAll(".method_item"));
  const bookingTypeInputs = Array.from(document.querySelectorAll("input[name='bookingType']"));
  const bookingTypeItems = bookingTypeInputs
    .map((input) => input.closest(".method_item"))
    .filter(Boolean);
  const cardForm = document.getElementById("cardForm");
  const transferForm = document.getElementById("transferForm");
  const mobileForm = document.getElementById("mobileForm");
  const guestInfoForm = document.getElementById("guestInfoForm");
  const journeySummary = document.getElementById("journeySummary");
  const journeyTripTypeElement = document.getElementById("journeyTripType");
  const journeyDepartureElement = document.getElementById("journeyDeparture");
  const journeyDestinationElement = document.getElementById("journeyDestination");
  const journeyTravelDateElement = document.getElementById("journeyTravelDate");
  const journeyReturnRow = document.getElementById("journeyReturnRow");
  const journeyReturnDateElement = document.getElementById("journeyReturnDate");
  const journeyPassengersElement = document.getElementById("journeyPassengers");

  const cardNumberInput = document.getElementById("cardNumber");
  const cardHolderInput = document.getElementById("cardHolder");
  const cardExpiryInput = document.getElementById("cardExpiry");
  const cardCvvInput = document.getElementById("cardCvv");
  const mobileNumberInput = document.getElementById("mobileNumber");
  const agreeTermsInput = document.getElementById("agreeTerms");

  const guestBookerLastNameInput = document.getElementById("guestBookerLastName");
  const guestBookerFirstNameInput = document.getElementById("guestBookerFirstName");
  const guestPassengerLastNameInput = document.getElementById("guestPassengerLastName");
  const guestPassengerFirstNameInput = document.getElementById("guestPassengerFirstName");

  const totalAmountElement = document.getElementById("totalAmount");
  const supplyAmountElement = document.getElementById("supplyAmount");
  const vatAmountElement = document.getElementById("vatAmount");
  const successAmountElement = document.getElementById("successAmount");
  const successReservationNumberElement = document.getElementById("successReservationNumber");
  const successDestinationElement = document.getElementById("successDestination");
  const successMessageElement = document.getElementById("successMessage");

  const airfareAmountElement = document.getElementById("airfareAmount");
  const stayAmountElement = document.getElementById("stayAmount");
  const carAmountElement = document.getElementById("carAmount");

  const formatPrice = (value) => `${value.toLocaleString()}원`;
  const digitsOnly = (value) => value.replace(/\D/g, "");
  const normalizeText = (value) => value.trim().replace(/\s+/g, " ");
  const BOOKING_DRAFT_STORAGE_KEY = "jejuair:booking-draft";
  const BOOKING_HANDOFF_STORAGE_KEY = "jejuair:booking-handoff";
  const BOOKING_HANDOFF_WINDOW_NAME_PREFIX = "jejuair:booking-handoff:v1:";
  const BOOKING_DRAFT_SOURCE = "SERVICES.AIR.BOOKING.AVAILABILITY";
  const BOOKING_DRAFT_TTL_MS = 15 * 60 * 1000;
  const query = new URLSearchParams(window.location.search);
  const clearStoredDraft = () => {
    try {
      window.sessionStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
    } catch (_error) {
      /* sessionStorage unavailable */
    }
  };
  const readStoredDraft = () => {
    try {
      const raw = window.sessionStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  };
  const readStoredHandoff = () => {
    try {
      const raw = window.sessionStorage.getItem(BOOKING_HANDOFF_STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  };
  const readNavigationHandoff = () => {
    try {
      const raw = String(window.name || "");
      if (!raw.startsWith(BOOKING_HANDOFF_WINDOW_NAME_PREFIX)) {
        return null;
      }

      const parsed = JSON.parse(raw.slice(BOOKING_HANDOFF_WINDOW_NAME_PREFIX.length));
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch (_error) {
      return null;
    }
  };
  const isDraftFresh = (savedAt) => {
    const savedTime = Date.parse(String(savedAt || ""));
    if (!Number.isFinite(savedTime)) {
      return false;
    }

    return Date.now() - savedTime <= BOOKING_DRAFT_TTL_MS;
  };
  const toDraftString = (value) => {
    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    return "";
  };
  const parseDraftShape = (source) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return null;
    }

    return {
      draftId: normalizeText(toDraftString(source.draftId)),
      savedAt: normalizeText(toDraftString(source.savedAt)),
      tripType: toDraftString(source.tripType),
      departure: toDraftString(source.departure),
      destination: toDraftString(source.destination),
      travelDate: toDraftString(source.travelDate),
      returnDate: toDraftString(source.returnDate),
      tripDays: toDraftString(source.tripDays),
      passengers: toDraftString(source.passengers),
      segments: typeof source.segments === "string" ? source.segments : "",
      total: toDraftString(source.total),
      handoffId: toDraftString(source.handoffId || source.handoff_id || ""),
      sourceRoute: toDraftString(source.sourceRoute || source.source_route || source.draftSource || ""),
      sourcePage: toDraftString(source.sourcePage || source.source_page || ""),
    };
  };
  const parseHandoffShape = (source) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return null;
    }

    return {
      handoffId: normalizeText(toDraftString(source.handoffId || source.handoff_id || "")),
      draftId: normalizeText(toDraftString(source.draftId || source.draft_id || "")),
      savedAt: normalizeText(toDraftString(source.savedAt || source.saved_at || "")),
      expiresAt: normalizeText(toDraftString(source.expiresAt || source.expires_at || "")),
      sourceRoute: toDraftString(source.sourceRoute || source.source_route || ""),
      sourcePage: toDraftString(source.sourcePage || source.source_page || ""),
      oneShot: toBoolean(source.oneShot ?? source.one_shot),
    };
  };
  const isAvailabilityDraftSource = (draft) => {
    if (!draft) {
      return false;
    }

    const normalizedSource = normalizeText(
      toDraftString(draft.sourceRoute || draft.sourcePage || draft.draftSource || draft.source || ""),
    ).toLowerCase();

    if (!normalizedSource) {
      return false;
    }

    return (
      normalizedSource === BOOKING_DRAFT_SOURCE.toLowerCase() ||
      normalizedSource.endsWith("/jejuair/pages/booking/availability.html") ||
      normalizedSource.endsWith("availability.html")
    );
  };
  const isFreshHandoff = (handoff) => {
    if (!handoff) {
      return false;
    }

    if (handoff.expiresAt) {
      const expiresTime = Date.parse(handoff.expiresAt);
      if (Number.isFinite(expiresTime) && Date.now() > expiresTime) {
        return false;
      }
    }

    return isDraftFresh(handoff.savedAt);
  };
  const clearStoredHandoff = () => {
    try {
      window.sessionStorage.removeItem(BOOKING_HANDOFF_STORAGE_KEY);
    } catch (_error) {
      /* sessionStorage unavailable */
    }
  };
  const clearNavigationHandoff = () => {
    try {
      if (String(window.name || "").startsWith(BOOKING_HANDOFF_WINDOW_NAME_PREFIX)) {
        window.name = "";
      }
    } catch (_error) {
      /* window.name unavailable */
    }
  };
  const isAvailabilityHandoff = (handoff) => {
    if (!handoff) {
      return false;
    }

    const normalizedSource = normalizeText(
      toDraftString(handoff.sourceRoute || handoff.sourcePage || ""),
    ).toLowerCase();

    if (!normalizedSource) {
      return false;
    }

    return (
      normalizedSource === BOOKING_DRAFT_SOURCE.toLowerCase() ||
      normalizedSource.endsWith("/jejuair/pages/booking/availability.html") ||
      normalizedSource.endsWith("availability.html")
    );
  };
  const effectiveHandoffMatchesStoredDraft = (handoff, draft) => {
    if (!handoff || !draft) {
      return false;
    }

    return Boolean(
      handoff.handoffId &&
      draft.handoffId &&
      handoff.draftId &&
      draft.draftId &&
      handoff.draftId === draft.draftId &&
      handoff.handoffId === draft.handoffId,
    );
  };
  const buildJourneySearchParams = (draft) => {
    const params = new URLSearchParams();

    if (!draft) {
      return params;
    }

    const append = (key, value) => {
      const normalized = normalizeText(toDraftString(value));
      if (normalized) {
        params.set(key, normalized);
      }
    };

    append("draftId", draft.draftId);
    append("handoffId", draft.handoffId);
    append("tripType", draft.tripType);
    append("departure", draft.departure);
    append("destination", draft.destination);
    append("travelDate", draft.travelDate);
    append("returnDate", draft.returnDate);
    append("tripDays", draft.tripDays);
    append("passengers", draft.passengers);
    append("segments", draft.segments);
    append("total", draft.total);

    return params;
  };
  const replaceJourneyUrl = (draft) => {
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.search = buildJourneySearchParams(draft).toString();
      window.history.replaceState(window.history.state, "", nextUrl.toString());
    } catch (_error) {
      /* URL replace unavailable */
    }
  };
  const normalizeTravelDate = (value) => {
    const trimmed = normalizeText(value)
      .replace(/[./]/g, "-")
      .replace(/\s+/g, "");
    if (!trimmed) return "";

    const match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) return "";

    const year = Number.parseInt(match[1], 10);
    const month = Number.parseInt(match[2], 10);
    const day = Number.parseInt(match[3], 10);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return "";
    }

    const candidate = new Date(year, month - 1, day);
    candidate.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(candidate.getTime()) ||
      candidate.getFullYear() !== year ||
      candidate.getMonth() !== month - 1 ||
      candidate.getDate() !== day
    ) {
      return "";
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };
  const parseAmount = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^\d-]/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  };
  const toBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const lowered = value.trim().toLowerCase();
      if (["true", "1", "yes", "y"].includes(lowered)) return true;
      if (["false", "0", "no", "n"].includes(lowered)) return false;
    }
    return undefined;
  };
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomPrice = () => randomInt(200, 2000) * 1000;
  const toThousand = (value) => Math.max(1000, Math.round(value / 1000) * 1000);
  const parseTripDays = (value) => {
    const parsed = Number.parseInt(String(value || "").trim(), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };
  const parseTripType = (value) => {
    const normalized = normalizeText(value).toLowerCase();
    return ["round", "oneway", "multi"].includes(normalized) ? normalized : "round";
  };
  const parseJourneySegments = (value) => {
    const raw = normalizeText(value || "");
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((segment) => ({
        departure: normalizeText(segment?.departure || segment?.from || ""),
        destination: normalizeText(segment?.destination || segment?.to || ""),
        travelDate: normalizeTravelDate(segment?.travelDate || segment?.travel_date || ""),
      }));
    } catch (_error) {
      return [];
    }
  };
  const isCompleteDraftCandidate = (draft) => {
    if (!draft) {
      return false;
    }

    const tripType = parseTripType(draft.tripType);
    const departure = normalizeText(draft.departure || "");
    const destination = normalizeText(draft.destination || "");
    const travelDate = normalizeTravelDate(draft.travelDate || "");
    const returnDate = normalizeTravelDate(draft.returnDate || "");
    const passengers = normalizeText(draft.passengers || "");
    const segments = parseJourneySegments(draft.segments || "");

    if (!departure || !destination || !passengers) {
      return false;
    }

    if (tripType === "round") {
      return Boolean(travelDate && returnDate);
    }

    if (tripType === "oneway") {
      return Boolean(travelDate);
    }

    if (tripType === "multi") {
      return segments.length > 0 && segments.every((segment) => (
        segment.departure && segment.destination && segment.travelDate
      ));
    }

    return false;
  };
  const queryDraft = parseDraftShape(Object.fromEntries(query.entries()));
  const storedDraft = parseDraftShape(readStoredDraft());
  const storedHandoff = parseHandoffShape(readStoredHandoff());
  const navigationHandoff = parseHandoffShape(readNavigationHandoff());
  if (storedDraft && !isDraftFresh(storedDraft.savedAt)) {
    clearStoredDraft();
  }
  if (storedHandoff && !isFreshHandoff(storedHandoff)) {
    clearStoredHandoff();
  }
  if (navigationHandoff && !isFreshHandoff(navigationHandoff)) {
    clearNavigationHandoff();
  }
  const effectiveStoredDraft = storedDraft && isDraftFresh(storedDraft.savedAt) ? storedDraft : null;
  const effectiveStoredHandoff = storedHandoff && isFreshHandoff(storedHandoff) ? storedHandoff : null;
  const effectiveNavigationHandoff = navigationHandoff && isFreshHandoff(navigationHandoff) ? navigationHandoff : null;
  const hasCompleteQueryDraft = isCompleteDraftCandidate(queryDraft);
  const hasCompleteStoredDraft = Boolean(
    effectiveStoredDraft &&
    isCompleteDraftCandidate(effectiveStoredDraft) &&
    isAvailabilityDraftSource(effectiveStoredDraft) &&
    effectiveNavigationHandoff &&
    isAvailabilityHandoff(effectiveNavigationHandoff) &&
    effectiveHandoffMatchesStoredDraft(effectiveNavigationHandoff, effectiveStoredDraft),
  );
  if (hasCompleteQueryDraft && (effectiveStoredHandoff?.handoffId || effectiveNavigationHandoff?.handoffId)) {
    clearStoredHandoff();
    clearNavigationHandoff();
  }
  if (hasCompleteQueryDraft && effectiveStoredDraft?.draftId && queryDraft.draftId !== effectiveStoredDraft.draftId) {
    clearStoredDraft();
  }
  const activeDraft = hasCompleteQueryDraft
    ? queryDraft
    : (hasCompleteStoredDraft ? effectiveStoredDraft : null);
  if (!hasCompleteQueryDraft && hasCompleteStoredDraft && effectiveStoredDraft) {
    replaceJourneyUrl(effectiveStoredDraft);
    clearStoredHandoff();
    clearNavigationHandoff();
  }
  const formatDateKey = (value) => {
    const date = value instanceof Date ? value : dateToKey(value);

    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const dateToKey = (value) => {
    const normalized = normalizeTravelDate(value);
    return normalized ? new Date(`${normalized}T00:00:00`) : null;
  };
  const addDays = (dateValue, days) => {
    const baseDate = dateToKey(dateValue);
    const parsedDays = parseTripDays(days);

    if (!baseDate || !parsedDays) {
      return "";
    }

    const result = new Date(baseDate);
    result.setDate(result.getDate() + parsedDays);
    return formatDateKey(result);
  };
  const diffDays = (travelDate, returnDate) => {
    const start = dateToKey(travelDate);
    const end = dateToKey(returnDate);

    if (!start || !end) {
      return null;
    }

    const delta = Math.round((end.getTime() - start.getTime()) / 86400000);
    return delta > 0 ? delta : null;
  };

  const buildAmountBreakdown = (total) => {
    const airfare = toThousand((total * randomInt(18, 32)) / 100);
    const stayMax = Math.max(1000, total - airfare - 1000);
    const stayRatio = randomInt(40, 62) / 100;
    const stay = Math.min(toThousand(total * stayRatio), stayMax);
    const car = Math.max(1000, total - airfare - stay);

    return {
      airfare,
      stay,
      car,
    };
  };

  const parsedTotal = Number(activeDraft?.total || "");
  const totalAmount = Number.isFinite(parsedTotal) && parsedTotal >= 200000 && parsedTotal <= 2000000
    ? Math.round(parsedTotal / 1000) * 1000
    : randomPrice();
  const amounts = buildAmountBreakdown(totalAmount);

  const supplyAmount = Math.round(totalAmount / 1.1);
  const vatAmount = totalAmount - supplyAmount;

  airfareAmountElement.textContent = formatPrice(amounts.airfare);
  stayAmountElement.textContent = formatPrice(amounts.stay);
  carAmountElement.textContent = formatPrice(amounts.car);
  totalAmountElement.textContent = formatPrice(totalAmount);
  supplyAmountElement.textContent = formatPrice(supplyAmount);
  vatAmountElement.textContent = formatPrice(vatAmount);
  successAmountElement.textContent = formatPrice(totalAmount);

  const getSelectedMethod = () => methodInputs.find((input) => input.checked)?.value || "card";
  const getSelectedBookingType = () => bookingTypeInputs.find((input) => input.checked)?.value || "member";
  const isGuestBooking = () => getSelectedBookingType() === "guest";

  const toggleGuestFields = () => {
    const showGuestFields = isGuestBooking();
    guestInfoForm?.classList.toggle("hidden", !showGuestFields);

    bookingTypeItems.forEach((item) => {
      const input = item.querySelector("input[name='bookingType']");
      item.classList.toggle("is_selected", input && input.checked);
    });

    if (successMessageElement) {
      successMessageElement.textContent = showGuestFields
        ? "비회원 예약은 결제 후 예약 조회 페이지에서 다시 확인해 주세요."
        : "회원 예약은 결제 후 마이페이지에서 바로 확인할 수 있습니다.";
    }
  };

  const setMethodForms = (method) => {
    cardForm.classList.toggle("hidden", method !== "card");
    transferForm.classList.toggle("hidden", method !== "transfer");
    mobileForm.classList.toggle("hidden", method !== "mobile");

    methodItems.forEach((item) => {
      const input = item.querySelector("input[name='paymentMethod']");
      item.classList.toggle("is_selected", input && input.value === method);
    });
  };

  const getGuestLookup = () => ({
    bookerLastName: normalizeText(guestBookerLastNameInput?.value || ""),
    bookerFirstName: normalizeText(guestBookerFirstNameInput?.value || ""),
    passengerLastName: normalizeText(guestPassengerLastNameInput?.value || ""),
    passengerFirstName: normalizeText(guestPassengerFirstNameInput?.value || ""),
  });

  const forwardedJourney = Object.freeze({
    draftId: normalizeText(activeDraft?.draftId || ""),
    tripType: parseTripType(activeDraft?.tripType || ""),
    departure: normalizeText(activeDraft?.departure || ""),
    destination: normalizeText(activeDraft?.destination || ""),
    travelDate: normalizeTravelDate(activeDraft?.travelDate || ""),
    returnDate: normalizeTravelDate(activeDraft?.returnDate || ""),
    tripDays: parseTripDays(activeDraft?.tripDays || ""),
    passengers: normalizeText(activeDraft?.passengers || ""),
    segments: parseJourneySegments(activeDraft?.segments || ""),
  });

  const getJourneyState = () => {
    const segments = Array.isArray(forwardedJourney.segments) ? forwardedJourney.segments : [];
    const validSegments = segments.filter((segment) => segment.departure && segment.destination && segment.travelDate);
    const firstSegment = validSegments[0] || null;
    const lastSegment = validSegments[validSegments.length - 1] || null;
    const returnDate = forwardedJourney.returnDate
      || (forwardedJourney.tripType === "round" && forwardedJourney.travelDate
        ? addDays(forwardedJourney.travelDate, forwardedJourney.tripDays)
        : forwardedJourney.tripType === "multi" && lastSegment?.travelDate
          ? lastSegment.travelDate
        : "");
    const resolvedTripDays = forwardedJourney.tripDays
      || diffDays(forwardedJourney.travelDate, returnDate)
      || (forwardedJourney.tripType === "oneway" ? 0 : null);

    return {
      ...forwardedJourney,
      departure: forwardedJourney.departure || firstSegment?.departure || "",
      destination: forwardedJourney.destination || lastSegment?.destination || "",
      segments: validSegments,
      travelDate: forwardedJourney.travelDate || firstSegment?.travelDate || "",
      returnDate,
      tripDays: resolvedTripDays,
    };
  };

  const getTripTypeLabel = (tripType) => {
    const labels = {
      round: "왕복",
      oneway: "편도",
      multi: "다구간",
    };

    return labels[tripType] || "왕복";
  };

  const renderJourneySummary = () => {
    const journey = getJourneyState();
    if (!journeySummary) return;

    if (journeyTripTypeElement) {
      journeyTripTypeElement.textContent = getTripTypeLabel(journey.tripType);
    }

    if (journeyDepartureElement) {
      journeyDepartureElement.textContent = journey.departure || "미입력";
    }

    if (journeyDestinationElement) {
      journeyDestinationElement.textContent = journey.destination || "미입력";
    }

    if (journeyTravelDateElement) {
      journeyTravelDateElement.textContent = journey.travelDate || "미입력";
    }

    const showReturnDate = Boolean(journey.returnDate && journey.tripType !== "multi");
    if (journeyReturnRow) {
      journeyReturnRow.classList.toggle("hidden", !showReturnDate);
    }

    if (journeyReturnDateElement) {
      journeyReturnDateElement.textContent = journey.returnDate || "-";
    }

    if (journeyPassengersElement) {
      journeyPassengersElement.textContent = journey.passengers || "성인 1";
    }
  };

  const validateJourneyFields = () => {
    const journey = getJourneyState();

    if (!journey.travelDate && journey.tripType !== "multi") {
      alert("예약 가능 여부 페이지에서 출발일을 다시 선택해 주세요.");
      return false;
    }

    if (!journey.departure || !journey.destination) {
      alert("예약 가능 여부 페이지에서 출발지와 도착지를 다시 선택해 주세요.");
      return false;
    }

    if (journey.tripType === "round" && !journey.returnDate) {
      alert("예약 가능 여부 페이지에서 왕복 일정을 다시 선택해 주세요.");
      return false;
    }

    if (journey.tripType === "multi") {
      if (!journey.segments.length) {
        alert("예약 가능 여부 페이지에서 다구간 여정을 다시 선택해 주세요.");
        return false;
      }

      const hasInvalidSegment = journey.segments.some((segment) => (
        !segment.departure || !segment.destination || !segment.travelDate
      ));

      if (hasInvalidSegment) {
        alert("예약 가능 여부 페이지에서 다구간 여정을 다시 선택해 주세요.");
        return false;
      }
    }

    return true;
  };

  const validateGuestFields = () => {
    if (!isGuestBooking()) return true;

    const lookup = getGuestLookup();

    if (!lookup.bookerLastName || !lookup.bookerFirstName) {
      alert("예약자 성과 이름을 입력해 주세요.");
      guestBookerLastNameInput.focus();
      return false;
    }

    if (!lookup.passengerLastName || !lookup.passengerFirstName) {
      alert("탑승객 성과 이름을 입력해 주세요.");
      guestPassengerLastNameInput.focus();
      return false;
    }

    return true;
  };

  const validatePayment = () => {
    const method = getSelectedMethod();

    if (!agreeTermsInput.checked) {
      alert("결제 약관에 동의해 주세요.");
      return false;
    }

    if (!validateJourneyFields()) return false;
    if (!validateGuestFields()) return false;

    if (method === "card") {
      if (digitsOnly(cardNumberInput.value).length !== 16) {
        alert("카드 번호를 정확히 입력해 주세요.");
        cardNumberInput.focus();
        return false;
      }

      if (!cardHolderInput.value.trim()) {
        alert("카드 소유자명을 입력해 주세요.");
        cardHolderInput.focus();
        return false;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardExpiryInput.value)) {
        alert("유효기간을 MM/YY 형식으로 입력해 주세요.");
        cardExpiryInput.focus();
        return false;
      }

      if (digitsOnly(cardCvvInput.value).length !== 3) {
        alert("CVV 3자리를 입력해 주세요.");
        cardCvvInput.focus();
        return false;
      }
    }

    if (method === "mobile" && digitsOnly(mobileNumberInput.value).length < 10) {
      alert("휴대폰 번호를 정확히 입력해 주세요.");
      mobileNumberInput.focus();
      return false;
    }

    return true;
  };

  const extractCheckoutResult = (payload) => {
    const journey = getJourneyState();
    const source = payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload?.result && typeof payload.result === "object"
        ? payload.result
        : payload?.booking && typeof payload.booking === "object"
          ? payload.booking
          : payload;

    const bookingNo = normalizeText(
      source?.booking_no
      || source?.bookingNo
      || source?.reservationNo
      || source?.reservation_no
      || "",
    );
    const destination = normalizeText(
      source?.destination
      || source?.arrival
      || source?.to
      || "",
    );
    const amount = parseAmount(source?.amount ?? source?.totalAmount ?? source?.paymentAmount);
    const memberBooking = toBoolean(source?.memberBooking ?? source?.member_booking) ?? !isGuestBooking();
    const lookupSource = source?.lookup && typeof source.lookup === "object"
      ? source.lookup
      : source;

    return {
      bookingNo,
      destination,
      amount,
      memberBooking,
      lookup: {
        travelDate: normalizeText(lookupSource?.travelDate || lookupSource?.travel_date || ""),
        lastName: normalizeText(
          lookupSource?.lastName
          || lookupSource?.passengerLastName
          || lookupSource?.bookerLastName
          || "",
        ),
        firstName: normalizeText(
          lookupSource?.firstName
          || lookupSource?.passengerFirstName
          || lookupSource?.bookerFirstName
          || "",
        ),
      },
    };
  };

  const buildCheckoutPayload = () => ({
    paymentMethod: getSelectedMethod(),
    totalAmount,
    supplyAmount,
    vatAmount,
    tripType: getJourneyState().tripType,
    destination: getJourneyState().destination,
    departure: getJourneyState().departure,
    travelDate: getJourneyState().travelDate,
    returnDate: getJourneyState().returnDate,
    tripDays: getJourneyState().tripDays,
    passengers: getJourneyState().passengers,
    segments: getJourneyState().segments,
    memberBooking: !isGuestBooking(),
    lookup: getGuestLookup(),
    memo: getJourneyState().tripType === "round"
      ? `왕복 ${getJourneyState().tripDays || ""}일 / 귀국일 ${getJourneyState().returnDate}`
      : getJourneyState().tripType === "multi"
        ? `다구간 / 구간 수 ${getJourneyState().tripDays || 0}`
      : `편도 / 출발일 ${getJourneyState().travelDate}`,
    payment: {
      cardNumber: digitsOnly(cardNumberInput.value),
      cardHolder: normalizeText(cardHolderInput.value),
      cardExpiry: normalizeText(cardExpiryInput.value),
      cardCvv: digitsOnly(cardCvvInput.value),
      mobileNumber: digitsOnly(mobileNumberInput.value),
    },
  });

  const renderSuccessPayload = (checkoutResult) => {
    const bookingNo = checkoutResult.bookingNo || "";
    const journey = getJourneyState();
    const destination = checkoutResult.destination || journey.destination || "";
    const amount = checkoutResult.amount ?? totalAmount;

    if (!bookingNo || !destination || amount === null || amount === undefined) {
      throw new Error("결제 응답에 예약 정보가 부족합니다.");
    }

    successReservationNumberElement.textContent = bookingNo;
    successDestinationElement.textContent = destination;
    successAmountElement.textContent = formatPrice(amount);

    const lookup = checkoutResult.lookup;
    const guestLookup = {
      reservationNo: bookingNo,
      travelDate: lookup.travelDate || journey.travelDate,
      lastName: lookup.lastName || getGuestLookup().passengerLastName || getGuestLookup().bookerLastName,
      firstName: lookup.firstName || getGuestLookup().passengerFirstName || getGuestLookup().bookerFirstName,
    };

    successConfirmBtn.dataset.target = checkoutResult.memberBooking ? "member" : "guest";
    successConfirmBtn.dataset.bookingNo = bookingNo;
    successConfirmBtn.dataset.travelDate = guestLookup.travelDate;
    successConfirmBtn.dataset.lastName = guestLookup.lastName;
    successConfirmBtn.dataset.firstName = guestLookup.firstName;
    successConfirmBtn.textContent = checkoutResult.memberBooking ? "마이페이지로 이동" : "예약 조회하기";

    if (successMessageElement) {
      successMessageElement.textContent = checkoutResult.memberBooking
        ? "회원 예약이 저장되었습니다. 마이페이지에서 예약 내역을 확인할 수 있습니다."
        : "비회원 예약이 저장되었습니다. 예약 조회 페이지로 이동해 확인해 주세요.";
    }
  };

  const buildGuestLookupUrl = () => {
    const bookingNo = successConfirmBtn.dataset.bookingNo || "";
    const travelDate = successConfirmBtn.dataset.travelDate || "";
    const lastName = successConfirmBtn.dataset.lastName || "";
    const firstName = successConfirmBtn.dataset.firstName || "";
    const query = new URLSearchParams();

    if (bookingNo) query.set("reservationNo", bookingNo);
    if (travelDate) query.set("travelDate", travelDate);
    if (lastName) query.set("lastName", lastName);
    if (firstName) query.set("firstName", firstName);

    return `/jejuair/pages/booking/viewOnOffReservationList.html?${query.toString()}`;
  };

  bookingTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      toggleGuestFields();
    });
  });

  methodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      setMethodForms(input.value);
    });
  });

  cardNumberInput.addEventListener("input", () => {
    const value = digitsOnly(cardNumberInput.value).slice(0, 16);
    cardNumberInput.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  });

  cardExpiryInput.addEventListener("input", () => {
    const value = digitsOnly(cardExpiryInput.value).slice(0, 4);
    cardExpiryInput.value = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
  });

  cardCvvInput.addEventListener("input", () => {
    cardCvvInput.value = digitsOnly(cardCvvInput.value).slice(0, 3);
  });

  mobileNumberInput.addEventListener("input", () => {
    const value = digitsOnly(mobileNumberInput.value).slice(0, 11);
    if (value.length < 4) {
      mobileNumberInput.value = value;
      return;
    }

    if (value.length < 8) {
      mobileNumberInput.value = `${value.slice(0, 3)}-${value.slice(3)}`;
      return;
    }

    mobileNumberInput.value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  });

  toggleGuestFields();
  setMethodForms(methodInputs.find((input) => input.checked)?.value || "card");
  renderJourneySummary();

  payButton.addEventListener("click", async () => {
    if (!validatePayment()) return;

    payButton.disabled = true;
    const originalText = payButton.textContent;
    payButton.textContent = "결제 처리 중...";

    try {
      const response = await fetch("/api/booking/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildCheckoutPayload()),
      });

      const responseText = await response.text();
      let payload = {};

      if (responseText) {
        try {
          payload = JSON.parse(responseText);
        } catch (_parseError) {
          alert("결제 응답을 해석할 수 없습니다.");
          return;
        }
      }

      if (!response.ok) {
        alert(payload?.message || payload?.error || "결제 처리에 실패했습니다.");
        return;
      }

      if (payload?.success === false) {
        alert(payload?.message || payload?.error || "결제 처리에 실패했습니다.");
        return;
      }

      const checkoutResult = extractCheckoutResult(payload);
      if (!checkoutResult.bookingNo || !checkoutResult.destination || !Number.isFinite(checkoutResult.amount)) {
        alert("결제 응답에 예약 정보가 부족합니다.");
        return;
      }

      renderSuccessPayload(checkoutResult);
      clearStoredDraft();
      clearStoredHandoff();
      clearNavigationHandoff();
      paymentContainer.classList.add("hidden");
      paymentSuccess.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error instanceof TypeError || error instanceof DOMException) {
        alert("결제 처리에 실패했습니다.");
        return;
      }

      alert(error instanceof Error ? error.message : "결제 처리에 실패했습니다.");
    } finally {
      payButton.disabled = false;
      payButton.textContent = originalText;
    }
  });

  successConfirmBtn.addEventListener("click", () => {
    if (successConfirmBtn.dataset.target === "guest") {
      window.location.href = buildGuestLookupUrl();
      return;
    }

    const memberUrl = "/pages/mypage/dashboard.html?shell=air";
    window.location.href = memberUrl;
  });

  backBtn.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    const fallbackUrl = "/jejuair/pages/booking/Availability.html";
    window.location.href = fallbackUrl;
  });
});
