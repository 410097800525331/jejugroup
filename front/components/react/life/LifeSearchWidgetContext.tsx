import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type MouseEvent,
  type PropsWithChildren
} from "react";
import {
  createRangeDatePickerState,
  getMonthStartTimestamp,
  getNextRangeSelection,
  shiftVisibleMonth
} from "@front-components/search/rangeDatePicker";
import type { SearchCalendarTab } from "@front-components/search/types";
import { LIFE_REQUIRED_OPTIONS } from "./lifeSearchWidgetData";

type GuestKey = "rooms" | "adults" | "children";
type PopupId = "destinationDropdown" | "guestPopupLarge" | "calendarPopup" | "optionsPopupLarge" | null;

interface LifeSearchWidgetState {
  destinationValue: string;
  hasTypedDestinationQuery: boolean;
  isDestinationOpen: boolean;
  isGuestOpen: boolean;
  isOptionsOpen: boolean;
  guest: Record<GuestKey, number>;
  requiredOptions: string[];
  calendar: ReturnType<typeof createRangeDatePickerState>;
}

type LifeSearchWidgetAction =
  | { type: "SET_DESTINATION_VALUE"; value: string }
  | { type: "MARK_TYPED_DESTINATION_QUERY" }
  | { type: "RESET_TYPED_DESTINATION_QUERY" }
  | { type: "TOGGLE_DESTINATION" }
  | { type: "CLOSE_DESTINATION" }
  | { type: "TOGGLE_GUEST" }
  | { type: "CLOSE_GUEST" }
  | { type: "TOGGLE_OPTIONS" }
  | { type: "CLOSE_OPTIONS" }
  | { type: "TOGGLE_REQUIRED_OPTION"; value: string }
  | { type: "ADJUST_GUEST"; key: GuestKey; delta: number }
  | { type: "OPEN_CALENDAR" }
  | { type: "CLOSE_CALENDAR" }
  | { type: "SHIFT_CALENDAR_MONTH"; delta: number }
  | { type: "SET_CALENDAR_TAB"; tab: SearchCalendarTab }
  | { type: "SET_FLEXIBLE_OPTION"; value: string }
  | { type: "SELECT_CALENDAR_DATE"; timestamp: number }
  | { type: "SET_CALENDAR_HOVER_DATE"; timestamp: number | null }
  | { type: "CONFIRM_CALENDAR" }
  | { type: "CLEAR_CALENDAR" };

interface LifeSearchWidgetContextValue {
  state: LifeSearchWidgetState;
  guestSummary: string;
  requiredOptionsSummary: string;
  checkInLabel: string;
  checkOutLabel: string;
  calendarWarning: string | null;
  searchButtonTitle?: string;
  setDestinationValue: (value: string) => void;
  ensureDestinationOpen: () => void;
  toggleDestination: (event: MouseEvent<HTMLElement>) => void;
  openDestinationInput: (event: MouseEvent<HTMLInputElement>) => void;
  selectDestination: (value: string) => void;
  toggleGuest: (event: MouseEvent<HTMLElement>) => void;
  adjustGuest: (key: GuestKey, delta: number, event: MouseEvent<HTMLButtonElement>) => void;
  toggleOptions: (event: MouseEvent<HTMLElement>) => void;
  toggleRequiredOption: (value: string) => void;
  toggleCalendar: (event: MouseEvent<HTMLElement>) => void;
  showPreviousMonth: () => void;
  showNextMonth: () => void;
  setCalendarTab: (tab: SearchCalendarTab) => void;
  selectFlexibleOption: (value: string) => void;
  selectCalendarDate: (timestamp: number) => void;
  setCalendarHoverDate: (timestamp: number) => void;
  clearCalendarHoverDate: () => void;
  clearCalendar: () => void;
  confirmCalendar: () => void;
  submitSearch: () => void;
  stopPropagation: (event: MouseEvent<HTMLElement>) => void;
}

export const LONG_STAY_SEARCH_SUBMIT_EVENT = "jeju:life-search-submit";

const MIN_LONG_STAY_DAYS = 14;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const initialState: LifeSearchWidgetState = {
  destinationValue: "",
  hasTypedDestinationQuery: false,
  isDestinationOpen: false,
  isGuestOpen: false,
  isOptionsOpen: false,
  guest: {
    rooms: 1,
    adults: 1,
    children: 0
  },
  requiredOptions: [],
  calendar: createRangeDatePickerState()
};

const LifeSearchWidgetContext = createContext<LifeSearchWidgetContextValue | null>(null);

const dateLabel = (value: number | null) => {
  if (!value) {
    return "날짜 선택";
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const lifeSearchWidgetReducer = (state: LifeSearchWidgetState, action: LifeSearchWidgetAction): LifeSearchWidgetState => {
  switch (action.type) {
    case "SET_DESTINATION_VALUE":
      return {
        ...state,
        destinationValue: action.value
      };
    case "MARK_TYPED_DESTINATION_QUERY":
      return {
        ...state,
        hasTypedDestinationQuery: true
      };
    case "RESET_TYPED_DESTINATION_QUERY":
      return {
        ...state,
        hasTypedDestinationQuery: false
      };
    case "TOGGLE_DESTINATION":
      return {
        ...state,
        isDestinationOpen: !state.isDestinationOpen,
        isGuestOpen: false,
        isOptionsOpen: false
      };
    case "CLOSE_DESTINATION":
      return {
        ...state,
        isDestinationOpen: false
      };
    case "TOGGLE_GUEST":
      return {
        ...state,
        isGuestOpen: !state.isGuestOpen,
        isDestinationOpen: false,
        isOptionsOpen: false
      };
    case "CLOSE_GUEST":
      return {
        ...state,
        isGuestOpen: false
      };
    case "TOGGLE_OPTIONS":
      return {
        ...state,
        isOptionsOpen: !state.isOptionsOpen,
        isDestinationOpen: false,
        isGuestOpen: false
      };
    case "CLOSE_OPTIONS":
      return {
        ...state,
        isOptionsOpen: false
      };
    case "TOGGLE_REQUIRED_OPTION": {
      const exists = state.requiredOptions.includes(action.value);
      return {
        ...state,
        requiredOptions: exists
          ? state.requiredOptions.filter((value) => value !== action.value)
          : [...state.requiredOptions, action.value]
      };
    }
    case "ADJUST_GUEST": {
      const nextValue = state.guest[action.key] + action.delta;
      const minValueMap: Record<GuestKey, number> = {
        rooms: 1,
        adults: 1,
        children: 0
      };

      if (nextValue < minValueMap[action.key]) {
        return state;
      }

      return {
        ...state,
        guest: {
          ...state.guest,
          [action.key]: nextValue
        }
      };
    }
    case "OPEN_CALENDAR":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          isOpen: true,
          tempCheckIn: state.calendar.checkIn,
          tempCheckOut: state.calendar.checkOut,
          hoverDate: null,
          visibleMonth: state.calendar.checkIn ? getMonthStartTimestamp(state.calendar.checkIn) : state.calendar.visibleMonth
        }
      };
    case "CLOSE_CALENDAR":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          isOpen: false,
          hoverDate: null,
          tempCheckIn: state.calendar.checkIn,
          tempCheckOut: state.calendar.checkOut
        }
      };
    case "SHIFT_CALENDAR_MONTH":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          hoverDate: null,
          visibleMonth: shiftVisibleMonth(state.calendar.visibleMonth, action.delta)
        }
      };
    case "SET_CALENDAR_TAB":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          activeTab: action.tab,
          hoverDate: null
        }
      };
    case "SET_FLEXIBLE_OPTION":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          activeTab: "flexible",
          flexibleValue: action.value
        }
      };
    case "SELECT_CALENDAR_DATE": {
      const nextSelection = getNextRangeSelection(
        {
          tempCheckIn: state.calendar.tempCheckIn,
          tempCheckOut: state.calendar.tempCheckOut
        },
        action.timestamp
      );

      return {
        ...state,
        calendar: {
          ...state.calendar,
          ...nextSelection,
          activeTab: "calendar"
        }
      };
    }
    case "SET_CALENDAR_HOVER_DATE": {
      const nextHoverDate =
        action.timestamp &&
        state.calendar.tempCheckIn &&
        !state.calendar.tempCheckOut &&
        action.timestamp > state.calendar.tempCheckIn
          ? action.timestamp
          : null;

      return {
        ...state,
        calendar: {
          ...state.calendar,
          hoverDate: nextHoverDate
        }
      };
    }
    case "CONFIRM_CALENDAR": {
      const committedCheckIn = state.calendar.tempCheckIn;
      const committedCheckOut = state.calendar.tempCheckOut;

      return {
        ...state,
        calendar: {
          ...state.calendar,
          isOpen: false,
          hoverDate: null,
          checkIn: committedCheckIn,
          checkOut: committedCheckOut,
          tempCheckIn: committedCheckIn,
          tempCheckOut: committedCheckOut,
          visibleMonth: committedCheckIn ? getMonthStartTimestamp(committedCheckIn) : state.calendar.visibleMonth
        }
      };
    }
    case "CLEAR_CALENDAR":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          hoverDate: null,
          checkIn: null,
          checkOut: null,
          tempCheckIn: null,
          tempCheckOut: null,
          flexibleValue: null
        }
      };
    default:
      return state;
  }
};

const closeOtherPopups = (dispatch: Dispatch<LifeSearchWidgetAction>, exceptId: PopupId = null) => {
  if (exceptId !== "destinationDropdown") {
    dispatch({ type: "CLOSE_DESTINATION" });
  }

  if (exceptId !== "guestPopupLarge") {
    dispatch({ type: "CLOSE_GUEST" });
  }

  if (exceptId !== "optionsPopupLarge") {
    dispatch({ type: "CLOSE_OPTIONS" });
  }

  if (exceptId !== "calendarPopup") {
    dispatch({ type: "CLOSE_CALENDAR" });
  }
};

export const LifeSearchWidgetProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(lifeSearchWidgetReducer, initialState);

  useEffect(() => {
    const handleDocumentClick = () => {
      closeOtherPopups(dispatch);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const stopPropagation = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  const setDestinationValue = useCallback((value: string) => {
    dispatch({ type: "SET_DESTINATION_VALUE", value });
    dispatch({ type: "MARK_TYPED_DESTINATION_QUERY" });
  }, []);

  const ensureDestinationOpen = useCallback(() => {
    closeOtherPopups(dispatch, "destinationDropdown");
    if (!state.isDestinationOpen) {
      dispatch({ type: "TOGGLE_DESTINATION" });
    }
  }, [state.isDestinationOpen]);

  const toggleDestination = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    closeOtherPopups(dispatch, "destinationDropdown");
    dispatch({ type: "TOGGLE_DESTINATION" });
  }, []);

  const openDestinationInput = useCallback(
    (event: MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      ensureDestinationOpen();
    },
    [ensureDestinationOpen]
  );

  const selectDestination = useCallback((value: string) => {
    dispatch({ type: "SET_DESTINATION_VALUE", value });
    dispatch({ type: "RESET_TYPED_DESTINATION_QUERY" });
    dispatch({ type: "CLOSE_DESTINATION" });
  }, []);

  const toggleGuest = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    closeOtherPopups(dispatch, "guestPopupLarge");
    dispatch({ type: "TOGGLE_GUEST" });
  }, []);

  const adjustGuest = useCallback((key: GuestKey, delta: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch({ type: "ADJUST_GUEST", key, delta });
  }, []);

  const toggleOptions = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    closeOtherPopups(dispatch, "optionsPopupLarge");
    dispatch({ type: "TOGGLE_OPTIONS" });
  }, []);

  const toggleRequiredOption = useCallback((value: string) => {
    dispatch({ type: "TOGGLE_REQUIRED_OPTION", value });
  }, []);

  const toggleCalendar = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();

      if (state.calendar.isOpen) {
        dispatch({ type: "CLOSE_CALENDAR" });
        return;
      }

      closeOtherPopups(dispatch, "calendarPopup");
      dispatch({ type: "OPEN_CALENDAR" });
    },
    [state.calendar.isOpen]
  );

  const showPreviousMonth = useCallback(() => {
    dispatch({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []);

  const showNextMonth = useCallback(() => {
    dispatch({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []);

  const setCalendarTab = useCallback((tab: SearchCalendarTab) => {
    dispatch({ type: "SET_CALENDAR_TAB", tab });
  }, []);

  const selectFlexibleOption = useCallback((value: string) => {
    dispatch({ type: "SET_FLEXIBLE_OPTION", value });
  }, []);

  const selectCalendarDate = useCallback((timestamp: number) => {
    dispatch({ type: "SELECT_CALENDAR_DATE", timestamp });
  }, []);

  const setCalendarHoverDate = useCallback((timestamp: number) => {
    dispatch({ type: "SET_CALENDAR_HOVER_DATE", timestamp });
  }, []);

  const clearCalendarHoverDate = useCallback(() => {
    dispatch({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []);

  const clearCalendar = useCallback(() => {
    dispatch({ type: "CLEAR_CALENDAR" });
  }, []);

  const confirmCalendar = useCallback(() => {
    const { tempCheckIn, tempCheckOut } = state.calendar;

    if (!tempCheckIn && !tempCheckOut) {
      dispatch({ type: "CLEAR_CALENDAR" });
      dispatch({ type: "CLOSE_CALENDAR" });
      return;
    }

    if (!tempCheckIn || !tempCheckOut) {
      window.alert("체크인과 체크아웃 날짜를 모두 선택해주세요");
      return;
    }

    const stayDays = (tempCheckOut - tempCheckIn) / ONE_DAY_MS;
    if (stayDays < MIN_LONG_STAY_DAYS) {
      window.alert(`장기 체류 서비스는 최소 ${MIN_LONG_STAY_DAYS}박부터 예약 가능합니다`);
      return;
    }

    dispatch({ type: "CONFIRM_CALENDAR" });
  }, [state.calendar]);

  const submitSearch = useCallback(() => {
    closeOtherPopups(dispatch);

    document.dispatchEvent(
      new CustomEvent(LONG_STAY_SEARCH_SUBMIT_EVENT, {
        detail: {
          destination: state.destinationValue.trim(),
          guest: state.guest,
          requiredOptions: state.requiredOptions,
          checkIn: state.calendar.checkIn,
          checkOut: state.calendar.checkOut,
          flexibleValue: state.calendar.flexibleValue
        }
      })
    );
  }, [state.calendar.checkIn, state.calendar.checkOut, state.calendar.flexibleValue, state.destinationValue, state.guest, state.requiredOptions]);

  const guestSummary = useMemo(() => {
    const parts = [`성인 ${state.guest.adults}명`, `객실 ${state.guest.rooms}개`];
    if (state.guest.children > 0) {
      parts.splice(1, 0, `아동 ${state.guest.children}명`);
    }
    return parts.join(", ");
  }, [state.guest.adults, state.guest.children, state.guest.rooms]);

  const selectedOptionLabels = useMemo(() => {
    return LIFE_REQUIRED_OPTIONS.filter((option) => state.requiredOptions.includes(option.value)).map((option) => option.label);
  }, [state.requiredOptions]);

  const requiredOptionsSummary = useMemo(() => {
    if (selectedOptionLabels.length === 0) {
      return "선택사항 없음";
    }

    if (selectedOptionLabels.length > 2) {
      return `${selectedOptionLabels[0]}, ${selectedOptionLabels[1]} 외 ${selectedOptionLabels.length - 2}`;
    }

    return selectedOptionLabels.join(", ");
  }, [selectedOptionLabels]);

  const checkInLabel = useMemo(() => {
    const displayValue = state.calendar.isOpen ? state.calendar.tempCheckIn ?? state.calendar.checkIn : state.calendar.checkIn;
    return dateLabel(displayValue);
  }, [state.calendar.checkIn, state.calendar.isOpen, state.calendar.tempCheckIn]);

  const checkOutLabel = useMemo(() => {
    const displayValue = state.calendar.isOpen ? state.calendar.tempCheckOut ?? state.calendar.checkOut : state.calendar.checkOut;
    return dateLabel(displayValue);
  }, [state.calendar.checkOut, state.calendar.isOpen, state.calendar.tempCheckOut]);

  const calendarWarning = useMemo(() => {
    const { tempCheckIn, tempCheckOut } = state.calendar;
    if (!tempCheckIn || !tempCheckOut) {
      return null;
    }

    const stayDays = (tempCheckOut - tempCheckIn) / ONE_DAY_MS;
    return stayDays < MIN_LONG_STAY_DAYS ? `* 최소 ${MIN_LONG_STAY_DAYS}박 이상 선택해주세요` : null;
  }, [state.calendar.tempCheckIn, state.calendar.tempCheckOut]);

  const searchButtonTitle = useMemo(() => {
    const { checkIn, checkOut } = state.calendar;
    if (!checkIn || !checkOut) {
      return undefined;
    }

    const stayDays = (checkOut - checkIn) / ONE_DAY_MS;
    return stayDays >= 28 ? `한 달 살기 특가 적용 (${stayDays}박)` : undefined;
  }, [state.calendar.checkIn, state.calendar.checkOut]);

  const value = useMemo<LifeSearchWidgetContextValue>(() => {
    return {
      state,
      guestSummary,
      requiredOptionsSummary,
      checkInLabel,
      checkOutLabel,
      calendarWarning,
      searchButtonTitle,
      setDestinationValue,
      ensureDestinationOpen,
      toggleDestination,
      openDestinationInput,
      selectDestination,
      toggleGuest,
      adjustGuest,
      toggleOptions,
      toggleRequiredOption,
      toggleCalendar,
      showPreviousMonth,
      showNextMonth,
      setCalendarTab,
      selectFlexibleOption,
      selectCalendarDate,
      setCalendarHoverDate,
      clearCalendarHoverDate,
      clearCalendar,
      confirmCalendar,
      submitSearch,
      stopPropagation
    };
  }, [
    state,
    guestSummary,
    requiredOptionsSummary,
    checkInLabel,
    checkOutLabel,
    calendarWarning,
    searchButtonTitle,
    setDestinationValue,
    ensureDestinationOpen,
    toggleDestination,
    openDestinationInput,
    selectDestination,
    toggleGuest,
    adjustGuest,
    toggleOptions,
    toggleRequiredOption,
    toggleCalendar,
    showPreviousMonth,
    showNextMonth,
    setCalendarTab,
    selectFlexibleOption,
    selectCalendarDate,
    setCalendarHoverDate,
    clearCalendarHoverDate,
    clearCalendar,
    confirmCalendar,
    submitSearch,
    stopPropagation
  ]);

  return <LifeSearchWidgetContext.Provider value={value}>{children}</LifeSearchWidgetContext.Provider>;
};

export const useLifeSearchWidget = () => {
  const context = useContext(LifeSearchWidgetContext);
  if (!context) {
    throw new Error("LifeSearchWidget context missing");
  }

  return context;
};
