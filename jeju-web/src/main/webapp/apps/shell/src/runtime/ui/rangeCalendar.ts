interface RangeCalendarState {
  checkIn: number | null;
  checkOut: number | null;
  tempCheckIn: number | null;
  tempCheckOut: number | null;
}

type RangeCalendarCallback = (state: RangeCalendarState, api: RangeCalendarApi, extra?: unknown) => void;

interface RangeCalendarConfig {
  fieldId?: string;
  popupId?: string;
  monthsContainerId?: string;
  dayPickerContainerId?: string;
  prevButtonId?: string;
  nextButtonId?: string;
  clearButtonId?: string;
  confirmButtonId?: string;
  tabCalendarId?: string;
  tabFlexibleId?: string;
  panelCalendarId?: string;
  panelFlexibleId?: string;
  flexibleOptionSelector?: string;
  weekStartsOn?: "monday" | "sunday";
  weekdayLabels?: string[] | null;
  monthLabelFormatter?: ((date: Date, state: RangeCalendarState, api: RangeCalendarApi) => string) | null;
  dayLabelFormatter?: ((day: number, timestamp: number, state: RangeCalendarState, api: RangeCalendarApi) => string) | null;
  monthsToRender?: number;
  showHoverRange?: boolean;
  enableTabs?: boolean;
  enableFlexibleOptions?: boolean;
  toggleMode?: "toggle" | "open-only";
  cancelOnToggleClose?: boolean;
  toggleFieldActiveClass?: boolean;
  openingClass?: string;
  openingClassDurationMs?: number;
  closeAllPopups?: ((exceptId?: string | null) => void) | null;
  onOpen?: RangeCalendarCallback | null;
  onClose?: RangeCalendarCallback | null;
  onCancel?: RangeCalendarCallback | null;
  onClear?: RangeCalendarCallback | null;
  onTempChange?: RangeCalendarCallback | null;
  onBeforeConfirm?: ((state: RangeCalendarState, api: RangeCalendarApi) => boolean | void) | null;
  onConfirm?: RangeCalendarCallback | null;
  state?: Partial<RangeCalendarState> | null;
  initialMonth?: Date | null;
}

interface RangeCalendarApi {
  init: () => RangeCalendarApi;
  renderCalendar: () => void;
  openCalendar: () => void;
  closeCalendar: (extra?: unknown) => void;
  cancelSelection: (extra?: unknown) => void;
  getState: () => RangeCalendarState;
  getMonth: () => Date;
  setMonth: (dateLike: Date | string | number) => void;
}

const ensureState = (source?: Partial<RangeCalendarState> | null): RangeCalendarState => {
  const state = source ?? {};
  return {
    checkIn: state.checkIn ?? null,
    checkOut: state.checkOut ?? null,
    tempCheckIn: state.tempCheckIn ?? null,
    tempCheckOut: state.tempCheckOut ?? null
  };
};

export const createRangeCalendar = (userConfig?: RangeCalendarConfig): RangeCalendarApi => {
  const config: Required<Omit<RangeCalendarConfig, "weekdayLabels" | "monthLabelFormatter" | "dayLabelFormatter" | "closeAllPopups" | "onOpen" | "onClose" | "onCancel" | "onClear" | "onTempChange" | "onBeforeConfirm" | "onConfirm" | "state" | "initialMonth">> &
    Pick<RangeCalendarConfig, "weekdayLabels" | "monthLabelFormatter" | "dayLabelFormatter" | "closeAllPopups" | "onOpen" | "onClose" | "onCancel" | "onClear" | "onTempChange" | "onBeforeConfirm" | "onConfirm" | "state" | "initialMonth"> = {
    fieldId: "checkInField",
    popupId: "calendarPopup",
    monthsContainerId: "calendarMonths",
    dayPickerContainerId: "dayPickerContainer",
    prevButtonId: "prevMonth",
    nextButtonId: "nextMonth",
    clearButtonId: "btn-clear",
    confirmButtonId: "btn-confirm",
    tabCalendarId: "tab-calendar",
    tabFlexibleId: "tab-flexible",
    panelCalendarId: "panel-calendar",
    panelFlexibleId: "panel-flexible",
    flexibleOptionSelector: ".Flexible-Option",
    weekStartsOn: "monday",
    weekdayLabels: null,
    monthLabelFormatter: null,
    dayLabelFormatter: null,
    monthsToRender: 2,
    showHoverRange: true,
    enableTabs: true,
    enableFlexibleOptions: true,
    toggleMode: "toggle",
    cancelOnToggleClose: false,
    toggleFieldActiveClass: false,
    openingClass: "",
    openingClassDurationMs: 0,
    closeAllPopups: null,
    onOpen: null,
    onClose: null,
    onCancel: null,
    onClear: null,
    onTempChange: null,
    onBeforeConfirm: null,
    onConfirm: null,
    state: null,
    initialMonth: null,
    ...(userConfig ?? {})
  };

  const state = ensureState(config.state);
  let currentMonth = config.initialMonth ? new Date(config.initialMonth) : new Date();
  let hoverDate: number | null = null;
  let initialized = false;
  let openingTimer: number | null = null;

  let refs: {
    field: HTMLElement | null;
    popup: HTMLElement | null;
    monthsContainer: HTMLElement | null;
    dayPickerContainer: HTMLElement | null;
    prevButton: HTMLElement | null;
    nextButton: HTMLElement | null;
    clearButton: HTMLElement | null;
    confirmButton: HTMLElement | null;
    tabCalendar: HTMLElement | null;
    tabFlexible: HTMLElement | null;
    panelCalendar: HTMLElement | null;
    panelFlexible: HTMLElement | null;
  } | null = null;

  const getRefs = () => {
    if (refs) {
      return refs;
    }

    refs = {
      field: document.getElementById(config.fieldId),
      popup: document.getElementById(config.popupId),
      monthsContainer: document.getElementById(config.monthsContainerId),
      dayPickerContainer: document.getElementById(config.dayPickerContainerId),
      prevButton: document.getElementById(config.prevButtonId),
      nextButton: document.getElementById(config.nextButtonId),
      clearButton: document.getElementById(config.clearButtonId),
      confirmButton: document.getElementById(config.confirmButtonId),
      tabCalendar: document.getElementById(config.tabCalendarId),
      tabFlexible: document.getElementById(config.tabFlexibleId),
      panelCalendar: document.getElementById(config.panelCalendarId),
      panelFlexible: document.getElementById(config.panelFlexibleId)
    };

    return refs;
  };

  const stopEvent = (event?: Event) => {
    event?.stopPropagation();
  };

  const runCallback = (callback: RangeCalendarCallback | null | undefined, extra?: unknown) => {
    if (typeof callback === "function") {
      callback(state, api, extra);
    }
  };

  const getWeekdayLabels = () => {
    if (Array.isArray(config.weekdayLabels) && config.weekdayLabels.length === 7) {
      return config.weekdayLabels;
    }

    if (config.weekStartsOn === "sunday") {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  };

  const toDayTimestamp = (value: Date | number) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };

  const getMonthOffset = (dayIndex: number) => {
    return config.weekStartsOn === "monday" ? (dayIndex === 0 ? 6 : dayIndex - 1) : dayIndex;
  };

  const effectiveCheckIn = () => state.tempCheckIn || state.checkIn;
  const effectiveCheckOut = () => state.tempCheckOut || state.checkOut;

  const formatMonthLabel = (date: Date) => {
    if (typeof config.monthLabelFormatter === "function") {
      return config.monthLabelFormatter(date, state, api);
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const formatDayLabel = (day: number, timestamp: number) => {
    if (typeof config.dayLabelFormatter === "function") {
      return config.dayLabelFormatter(day, timestamp, state, api);
    }

    return String(day);
  };

  const buildMonthDaysHtml = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = getMonthOffset(firstDay);
    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayTs = toDayTimestamp(new Date());
    const checkIn = effectiveCheckIn();
    const checkOut = effectiveCheckOut();

    let html = "";

    for (let i = 0; i < startOffset; i += 1) {
      html += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    }

    for (let day = 1; day <= lastDate; day += 1) {
      const ts = new Date(year, month, day).getTime();
      const classNames = ["DayPicker-Day"];

      if (ts < todayTs) {
        classNames.push("DayPicker-Day--disabled");
      }
      if (ts === todayTs) {
        classNames.push("DayPicker-Day--today");
      }
      if (checkIn && ts === checkIn) {
        classNames.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange");
      }
      if (checkOut && ts === checkOut) {
        classNames.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange");
      }
      if (checkIn && checkOut && ts > checkIn && ts < checkOut) {
        classNames.push("DayPicker-Day--inRange");
      }
      if (config.showHoverRange && checkIn && !checkOut && hoverDate && ts > checkIn && ts <= hoverDate) {
        classNames.push("DayPicker-Day--hoverRange");
        if (ts === hoverDate) {
          classNames.push("DayPicker-Day--hoverEnd");
        }
      }

      html += `<div class="${classNames.join(" ")}" data-timestamp="${ts}" data-day="${day}">${formatDayLabel(day, ts)}</div>`;
    }

    return html;
  };

  const updateHoverEffect = () => {
    const { popup } = getRefs();
    if (!popup) {
      return;
    }

    popup.querySelectorAll<HTMLElement>(".DayPicker-Day").forEach((dayElement) => {
      dayElement.classList.remove("DayPicker-Day--hoverRange");
      dayElement.classList.remove("DayPicker-Day--hoverEnd");
      if (!config.showHoverRange) {
        return;
      }

      const ts = Number.parseInt(dayElement.dataset.timestamp ?? "", 10);
      if (!Number.isFinite(ts)) {
        return;
      }

      if (state.tempCheckIn && !state.tempCheckOut && hoverDate && ts > state.tempCheckIn && ts <= hoverDate) {
        dayElement.classList.add("DayPicker-Day--hoverRange");
        if (ts === hoverDate) {
          dayElement.classList.add("DayPicker-Day--hoverEnd");
        }
      }
    });
  };

  const handleDateClick = (timestamp: number) => {
    if (!state.tempCheckIn || (state.tempCheckIn && state.tempCheckOut)) {
      state.tempCheckIn = timestamp;
      state.tempCheckOut = null;
      hoverDate = null;
    } else if (timestamp < state.tempCheckIn) {
      state.tempCheckIn = timestamp;
      hoverDate = null;
    } else if (timestamp > state.tempCheckIn) {
      state.tempCheckOut = timestamp;
      hoverDate = null;
    }

    runCallback(config.onTempChange ?? null);
    renderCalendar();
  };

  const attachDayListeners = () => {
    const { popup, dayPickerContainer } = getRefs();
    if (!popup) {
      return;
    }

    popup
      .querySelectorAll<HTMLElement>(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)")
      .forEach((dayElement) => {
        dayElement.addEventListener("click", (event) => {
          stopEvent(event);
          const ts = Number.parseInt(dayElement.dataset.timestamp ?? "", 10);
          if (Number.isFinite(ts)) {
            handleDateClick(ts);
          }
        });

        if (!config.showHoverRange) {
          return;
        }

        dayElement.addEventListener("mouseenter", () => {
          const ts = Number.parseInt(dayElement.dataset.timestamp ?? "", 10);
          if (!Number.isFinite(ts)) {
            return;
          }

          if (state.tempCheckIn && !state.tempCheckOut && ts > state.tempCheckIn) {
            hoverDate = ts;
            updateHoverEffect();
          }
        });
      });

    if (dayPickerContainer && config.showHoverRange) {
      dayPickerContainer.onmouseleave = () => {
        if (!hoverDate) {
          return;
        }

        hoverDate = null;
        updateHoverEffect();
      };
    }
  };

  const activateTab = (targetTab: HTMLElement | null) => {
    const { tabCalendar, tabFlexible, panelCalendar, panelFlexible } = getRefs();

    [tabCalendar, tabFlexible].forEach((tab) => {
      if (!tab) {
        return;
      }

      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    [panelCalendar, panelFlexible].forEach((panel) => {
      if (!panel) {
        return;
      }

      panel.classList.remove("active");
      (panel as HTMLElement).style.display = "none";
    });

    if (!targetTab) {
      return;
    }

    targetTab.classList.add("active");
    targetTab.setAttribute("aria-selected", "true");

    if (targetTab === tabCalendar && panelCalendar) {
      panelCalendar.classList.add("active");
      panelCalendar.style.display = "block";
    }

    if (targetTab === tabFlexible && panelFlexible) {
      panelFlexible.classList.add("active");
      panelFlexible.style.display = "block";
    }
  };

  const openCalendar = () => {
    const { field, popup } = getRefs();
    if (!field || !popup) {
      return;
    }

    if (typeof config.closeAllPopups === "function") {
      config.closeAllPopups(config.popupId);
    }

    state.tempCheckIn = state.checkIn;
    state.tempCheckOut = state.checkOut;
    hoverDate = null;

    popup.classList.add("active");
    if (config.toggleFieldActiveClass) {
      field.classList.add("active");
    }

    if (config.openingClass) {
      popup.classList.add(config.openingClass);
      if (openingTimer) {
        window.clearTimeout(openingTimer);
      }
      if (config.openingClassDurationMs > 0) {
        openingTimer = window.setTimeout(() => {
          popup.classList.remove(config.openingClass);
        }, config.openingClassDurationMs);
      }
    }

    runCallback(config.onTempChange ?? null);
    renderCalendar();
    runCallback(config.onOpen ?? null);
  };

  const closeCalendar = (extra?: unknown) => {
    const { field, popup } = getRefs();
    if (!popup) {
      return;
    }

    popup.classList.remove("active");
    if (config.openingClass) {
      popup.classList.remove(config.openingClass);
    }
    if (config.toggleFieldActiveClass && field) {
      field.classList.remove("active");
    }

    runCallback(config.onClose ?? null, extra);
  };

  const cancelSelection = (extra?: unknown) => {
    state.tempCheckIn = null;
    state.tempCheckOut = null;
    hoverDate = null;
    runCallback(config.onTempChange ?? null);
    runCallback(config.onCancel ?? null, extra);
  };

  const handleConfirm = (event: Event) => {
    stopEvent(event);

    if (typeof config.onBeforeConfirm === "function") {
      const result = config.onBeforeConfirm(state, api);
      if (result === false) {
        return;
      }
    }

    state.checkIn = state.tempCheckIn;
    state.checkOut = state.tempCheckOut;

    runCallback(config.onConfirm ?? null);

    if (typeof config.closeAllPopups === "function") {
      config.closeAllPopups();
      const { field } = getRefs();
      if (config.toggleFieldActiveClass && field) {
        field.classList.remove("active");
      }
      return;
    }

    closeCalendar({ reason: "confirm" });
  };

  const renderCalendar = () => {
    const { monthsContainer } = getRefs();
    if (!monthsContainer) {
      return;
    }

    monthsContainer.innerHTML = "";
    const labels = getWeekdayLabels();

    for (let offset = 0; offset < config.monthsToRender; offset += 1) {
      const monthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
      const monthElement = document.createElement("div");
      monthElement.className = "DayPicker-Month";

      const captionElement = document.createElement("div");
      captionElement.className = "DayPicker-Caption";
      captionElement.textContent = formatMonthLabel(monthDate);
      monthElement.appendChild(captionElement);

      const weekdayElement = document.createElement("div");
      weekdayElement.className = "DayPicker-Weekdays";
      labels.forEach((label) => {
        const node = document.createElement("div");
        node.className = "DayPicker-Weekday";
        node.textContent = label;
        weekdayElement.appendChild(node);
      });
      monthElement.appendChild(weekdayElement);

      const bodyElement = document.createElement("div");
      bodyElement.className = "DayPicker-Body";
      bodyElement.innerHTML = buildMonthDaysHtml(monthDate);
      monthElement.appendChild(bodyElement);

      monthsContainer.appendChild(monthElement);
    }

    attachDayListeners();
  };

  const init = () => {
    if (initialized) {
      return api;
    }

    const { field, popup, prevButton, nextButton, clearButton, confirmButton, tabCalendar, tabFlexible } = getRefs();
    if (!field || !popup) {
      return api;
    }

    field.addEventListener("click", (event) => {
      stopEvent(event);
      const active = popup.classList.contains("active");
      if (!active) {
        openCalendar();
        return;
      }

      if (config.toggleMode !== "toggle") {
        return;
      }

      if (config.cancelOnToggleClose) {
        cancelSelection({ reason: "toggle" });
      }

      closeCalendar({ reason: "toggle" });
    });

    popup.addEventListener("click", stopEvent);

    prevButton?.addEventListener("click", (event) => {
      stopEvent(event);
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderCalendar();
    });

    nextButton?.addEventListener("click", (event) => {
      stopEvent(event);
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderCalendar();
    });

    clearButton?.addEventListener("click", (event) => {
      stopEvent(event);
      state.checkIn = null;
      state.checkOut = null;
      state.tempCheckIn = null;
      state.tempCheckOut = null;
      hoverDate = null;
      runCallback(config.onTempChange ?? null);
      renderCalendar();
      runCallback(config.onClear ?? null);
    });

    confirmButton?.addEventListener("click", handleConfirm);

    if (config.enableTabs) {
      tabCalendar?.addEventListener("click", (event) => {
        stopEvent(event);
        activateTab(tabCalendar);
      });

      tabFlexible?.addEventListener("click", (event) => {
        stopEvent(event);
        activateTab(tabFlexible);
      });
    }

    if (config.enableFlexibleOptions) {
      popup.querySelectorAll<HTMLElement>(config.flexibleOptionSelector).forEach((optionElement) => {
        optionElement.addEventListener("click", (event) => {
          stopEvent(event);
          popup.querySelectorAll<HTMLElement>(config.flexibleOptionSelector).forEach((element) => {
            element.classList.remove("active");
          });
          optionElement.classList.add("active");
        });
      });
    }

    initialized = true;
    return api;
  };

  const setMonth = (dateLike: Date | string | number) => {
    currentMonth = new Date(dateLike);
    renderCalendar();
  };

  const getMonth = () => {
    return new Date(currentMonth);
  };

  const api: RangeCalendarApi = {
    init,
    renderCalendar,
    openCalendar,
    closeCalendar,
    cancelSelection,
    getState: () => state,
    getMonth,
    setMonth
  };

  return api;
};

export const installRangeCalendarGlobal = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (config?: Record<string, unknown>) => createRangeCalendar(config as RangeCalendarConfig)
  };
};
