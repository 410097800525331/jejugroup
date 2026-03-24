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
import { resolveRoute } from "@front-core-utils/path_resolver.js";
import { buildHotelListRouteParams, type HotelSearchInitialState } from "./hotelSearchQuery";

type SearchTab = "hotel" | "pension" | "activity";
type GuestKey = "rooms" | "adults" | "children";
type PopupId = "destinationDropdown" | "guestPopupLarge" | "calendarPopup" | null;

interface SearchWidgetState {
  activeTab: SearchTab;
  destinationValue: string;
  isDestinationOpen: boolean;
  isGuestOpen: boolean;
  guest: Record<GuestKey, number>;
  calendar: ReturnType<typeof createRangeDatePickerState>;
}

type SearchWidgetAction =
  | { type: "SET_ACTIVE_TAB"; tab: SearchTab }
  | { type: "SET_DESTINATION_VALUE"; value: string }
  | { type: "TOGGLE_DESTINATION" }
  | { type: "CLOSE_DESTINATION" }
  | { type: "TOGGLE_GUEST" }
  | { type: "CLOSE_GUEST" }
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

interface SearchWidgetContextValue {
  state: SearchWidgetState;
  isHotelMode: boolean;
  guestSummary: string;
  checkInLabel: string;
  checkOutLabel: string;
  setActiveTab: (tab: SearchTab) => void;
  setDestinationValue: (value: string) => void;
  toggleDestination: (event: MouseEvent<HTMLElement>) => void;
  openDestinationInput: (event: MouseEvent<HTMLInputElement>) => void;
  selectDestination: (value: string) => void;
  toggleGuest: (event: MouseEvent<HTMLElement>) => void;
  adjustGuest: (key: GuestKey, delta: number, event: MouseEvent<HTMLButtonElement>) => void;
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

const SearchWidgetContext = createContext<SearchWidgetContextValue | null>(null);

const createInitialSearchWidgetState = (providedState?: HotelSearchInitialState): SearchWidgetState => {
  const calendarState = createRangeDatePickerState();
  const checkIn = providedState?.calendar?.checkIn ?? null;
  const checkOut = providedState?.calendar?.checkOut ?? null;

  return {
    activeTab: "hotel",
    destinationValue: providedState?.destinationValue ?? "",
    isDestinationOpen: false,
    isGuestOpen: false,
    guest: {
      rooms: Math.max(1, providedState?.guest?.rooms ?? 1),
      adults: Math.max(1, providedState?.guest?.adults ?? 1),
      children: Math.max(0, providedState?.guest?.children ?? 0)
    },
    calendar: {
      ...calendarState,
      checkIn,
      checkOut,
      tempCheckIn: checkIn,
      tempCheckOut: checkOut,
      visibleMonth: checkIn ? getMonthStartTimestamp(checkIn) : calendarState.visibleMonth
    }
  };
};

const dateLabel = (value: number | null, fallbackLabel: "체크인" | "체크아웃") => {
  if (!value) {
    return fallbackLabel;
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const searchWidgetReducer = (state: SearchWidgetState, action: SearchWidgetAction): SearchWidgetState => {
  switch (action.type) {
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: action.tab,
        isDestinationOpen: false,
        isGuestOpen: false,
        calendar: {
          ...state.calendar,
          isOpen: false,
          hoverDate: null,
          tempCheckIn: state.calendar.checkIn,
          tempCheckOut: state.calendar.checkOut
        }
      };
    case "SET_DESTINATION_VALUE":
      return {
        ...state,
        destinationValue: action.value
      };
    case "TOGGLE_DESTINATION":
      return {
        ...state,
        isDestinationOpen: !state.isDestinationOpen,
        isGuestOpen: false
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
        isDestinationOpen: false
      };
    case "CLOSE_GUEST":
      return {
        ...state,
        isGuestOpen: false
      };
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

const closeOtherPopups = (dispatch: Dispatch<SearchWidgetAction>, exceptId: PopupId = null) => {
  if (exceptId !== "destinationDropdown") {
    dispatch({ type: "CLOSE_DESTINATION" });
  }

  if (exceptId !== "guestPopupLarge") {
    dispatch({ type: "CLOSE_GUEST" });
  }

  if (exceptId !== "calendarPopup") {
    dispatch({ type: "CLOSE_CALENDAR" });
  }
};

type HotelSearchWidgetProviderProps = PropsWithChildren<{
  initialState?: HotelSearchInitialState;
}>;

export const HotelSearchWidgetProvider = ({ children, initialState }: HotelSearchWidgetProviderProps) => {
  const [state, dispatch] = useReducer(searchWidgetReducer, initialState, createInitialSearchWidgetState);

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

  const setActiveTab = useCallback((tab: SearchTab) => {
    closeOtherPopups(dispatch);
    dispatch({ type: "SET_ACTIVE_TAB", tab });
  }, []);

  const setDestinationValue = useCallback((value: string) => {
    dispatch({ type: "SET_DESTINATION_VALUE", value });
  }, []);

  const toggleDestination = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    closeOtherPopups(dispatch, "destinationDropdown");
    dispatch({ type: "TOGGLE_DESTINATION" });
  }, []);

  const openDestinationInput = useCallback(
    (event: MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      closeOtherPopups(dispatch, "destinationDropdown");
      dispatch({ type: "SET_DESTINATION_VALUE", value: event.currentTarget.value });
      if (!state.isDestinationOpen) {
        dispatch({ type: "TOGGLE_DESTINATION" });
      }
    },
    [state.isDestinationOpen]
  );

  const selectDestination = useCallback((value: string) => {
    dispatch({ type: "SET_DESTINATION_VALUE", value });
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

  const toggleCalendar = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();

      if (state.calendar.isOpen) {
        dispatch({ type: "CONFIRM_CALENDAR" });
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
    dispatch({ type: "CONFIRM_CALENDAR" });
  }, []);

  const submitSearch = useCallback(() => {
    closeOtherPopups(dispatch);

    const targetUrl = resolveRoute(
      "SERVICES.STAY.HOTEL_LIST",
      buildHotelListRouteParams(
        {
          destinationValue: state.destinationValue,
          guest: state.guest,
          calendar: {
            checkIn: state.calendar.checkIn,
            checkOut: state.calendar.checkOut
          }
        },
        window.location.search
      )
    );

    window.location.assign(targetUrl);
  }, [
    state.calendar.checkIn,
    state.calendar.checkOut,
    state.destinationValue,
    state.guest
  ]);

  const isHotelMode = state.activeTab !== "activity";

  const guestSummary = useMemo(() => {
    const parts = [`성인 ${state.guest.adults}명`, `객실 ${state.guest.rooms}개`];
    if (state.guest.children > 0) {
      parts.push(`아동 ${state.guest.children}명`);
    }
    return parts.join(", ");
  }, [state.guest.adults, state.guest.children, state.guest.rooms]);

  const checkInLabel = useMemo(() => {
    const displayValue = state.calendar.isOpen ? state.calendar.tempCheckIn ?? state.calendar.checkIn : state.calendar.checkIn;
    return dateLabel(displayValue, "체크인");
  }, [state.calendar.checkIn, state.calendar.isOpen, state.calendar.tempCheckIn]);

  const checkOutLabel = useMemo(() => {
    const displayValue = state.calendar.isOpen ? state.calendar.tempCheckOut ?? state.calendar.checkOut : state.calendar.checkOut;
    return dateLabel(displayValue, "체크아웃");
  }, [state.calendar.checkOut, state.calendar.isOpen, state.calendar.tempCheckOut]);

  const value = useMemo<SearchWidgetContextValue>(() => {
    return {
      state,
      isHotelMode,
      guestSummary,
      checkInLabel,
      checkOutLabel,
      setActiveTab,
      setDestinationValue,
      toggleDestination,
      openDestinationInput,
      selectDestination,
      toggleGuest,
      adjustGuest,
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
    isHotelMode,
    guestSummary,
    checkInLabel,
    checkOutLabel,
    setActiveTab,
    setDestinationValue,
    toggleDestination,
    openDestinationInput,
    selectDestination,
    toggleGuest,
    adjustGuest,
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

  return <SearchWidgetContext.Provider value={value}>{children}</SearchWidgetContext.Provider>;
};

export const useHotelSearchWidget = () => {
  const context = useContext(SearchWidgetContext);
  if (!context) {
    throw new Error("HotelSearchWidget context missing");
  }

  return context;
};
