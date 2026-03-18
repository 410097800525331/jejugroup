import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { BOOKINGS } from "@front-components/mypage/data";
import type { BookingItem, BookingType } from "@front-components/mypage/types";

type BookingFilter = "all" | BookingType;

interface DashboardState {
  bookings: BookingItem[];
  filter: BookingFilter;
}

type DashboardAction =
  | { type: "HYDRATE_BOOKINGS"; payload: BookingItem[] }
  | { type: "SET_FILTER"; payload: BookingFilter };

const initialState = (): DashboardState => ({
  bookings: [...BOOKINGS],
  filter: "all",
});

const reducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "HYDRATE_BOOKINGS":
      return { ...state, bookings: [...action.payload] };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

interface DashboardContextValue {
  dispatch: Dispatch<DashboardAction>;
  state: DashboardState;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const value = useMemo(
    () => ({
      dispatch,
      state,
    }),
    [state],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardState = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardState must be used within DashboardProvider");
  }
  return context;
};
