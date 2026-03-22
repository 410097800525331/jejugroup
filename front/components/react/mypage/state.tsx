import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from "react";
import { applyDashboardSnapshot, createDashboardFallbackSnapshot, normalizeDashboardSnapshot } from "@front-components/mypage/data";
import type { BookingItem, BookingType, DashboardSnapshot, ItineraryItem, StatItem, SupportItem, UserProfile } from "./types";

type BookingFilter = "all" | BookingType;

export interface DashboardState {
  bookings: BookingItem[];
  filter: BookingFilter;
  itinerary: ItineraryItem[];
  profile: UserProfile;
  stats: StatItem[];
  supportItems: SupportItem[];
}

type DashboardAction =
  | { type: "HYDRATE_DASHBOARD"; payload: DashboardSnapshot }
  | { type: "PATCH_PROFILE"; payload: Partial<UserProfile> }
  | { type: "SET_ITINERARY"; payload: ItineraryItem[] }
  | { type: "SET_FILTER"; payload: BookingFilter };

const SESSION_STORAGE_KEY = "userSession";
const SESSION_EVENT_NAME = "jeju:session-updated";
const SESSION_ENDPOINT = "/api/auth/session";

const initialState = (): DashboardState => {
  const snapshot = createDashboardFallbackSnapshot();

  return {
    bookings: snapshot.bookings,
    filter: "all",
    itinerary: snapshot.itinerary,
    profile: snapshot.profile,
    stats: snapshot.stats,
    supportItems: snapshot.supportItems,
  };
};

const reducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "HYDRATE_DASHBOARD":
      return {
        ...state,
        bookings: action.payload.bookings.map((booking) => ({
          ...booking,
          tags: [...booking.tags],
        })),
        itinerary: action.payload.itinerary.map((item) => ({
          ...item,
          activities: item.activities.map((activity) => ({ ...activity })),
          companions: item.companions.map((companion) => ({ ...companion })),
        })),
        profile: {
          ...action.payload.profile,
          memberships: [...action.payload.profile.memberships],
          passport: action.payload.profile.passport ? { ...action.payload.profile.passport } : undefined,
        },
        stats: action.payload.stats.map((stat) => ({ ...stat })),
        supportItems: action.payload.supportItems.map((item) => ({ ...item })),
      };
    case "PATCH_PROFILE":
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
          memberships: action.payload.memberships ? [...action.payload.memberships] : [...state.profile.memberships],
          passport:
            action.payload.passport === undefined
              ? state.profile.passport
                ? { ...state.profile.passport }
                : undefined
              : action.payload.passport
                ? { ...action.payload.passport }
                : undefined,
        },
      };
    case "SET_ITINERARY":
      return {
        ...state,
        itinerary: action.payload.map((item) => ({
          ...item,
          activities: item.activities.map((activity) => ({ ...activity })),
          companions: item.companions.map((companion) => ({ ...companion })),
        })),
      };
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

const parseSessionPayload = (rawValue: string | null): unknown | null => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const readStoredSession = (): unknown | null => {
  try {
    return parseSessionPayload(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
};

const fetchSessionFromServer = async (): Promise<unknown | null> => {
  try {
    const response = await fetch(SESSION_ENDPOINT, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });

    if (response.status === 401 || !response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
};

const resolveSession = async (): Promise<unknown | null> => {
  const storedSession = readStoredSession();
  if (storedSession) {
    return storedSession;
  }

  return await fetchSessionFromServer();
};

const snapshotFromState = (state: DashboardState): DashboardSnapshot => ({
  bookings: state.bookings,
  itinerary: state.itinerary,
  profile: state.profile,
  stats: state.stats,
  supportItems: state.supportItems,
});

const mergeProfilePatch = (profile: UserProfile, patch: Partial<UserProfile>): UserProfile => ({
  ...profile,
  ...patch,
  memberships: patch.memberships ? [...patch.memberships] : [...profile.memberships],
  passport:
    patch.passport === undefined
      ? profile.passport
        ? { ...profile.passport }
        : undefined
      : patch.passport
        ? { ...patch.passport }
        : undefined,
});

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const handleDispatch = (action: DashboardAction) => {
    if (action.type === "HYDRATE_DASHBOARD") {
      applyDashboardSnapshot(action.payload);
    } else if (action.type === "PATCH_PROFILE") {
      applyDashboardSnapshot({
        bookings: state.bookings,
        itinerary: state.itinerary,
        profile: mergeProfilePatch(state.profile, action.payload),
        stats: state.stats,
        supportItems: state.supportItems,
      });
    }

    dispatch(action);
  };

  useEffect(() => {
    applyDashboardSnapshot(snapshotFromState(state));
  }, [state.bookings, state.itinerary, state.profile, state.stats, state.supportItems]);

  useEffect(() => {
    let active = true;

    const hydrate = async (source?: unknown | null) => {
      const resolvedSession = source === undefined ? await resolveSession() : source;
      const snapshot = normalizeDashboardSnapshot(resolvedSession);

      if (!active) {
        return;
      }

      applyDashboardSnapshot(snapshot);
      dispatch({ type: "HYDRATE_DASHBOARD", payload: snapshot });
    };

    void hydrate();

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SESSION_STORAGE_KEY) {
        return;
      }

      void hydrate(parseSessionPayload(event.newValue));
    };

    const handleSessionUpdate = (event: Event) => {
      const detail = event instanceof CustomEvent ? (event.detail as { session?: unknown | null } | null) : null;
      void hydrate(detail?.session ?? null);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(SESSION_EVENT_NAME, handleSessionUpdate as EventListener);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SESSION_EVENT_NAME, handleSessionUpdate as EventListener);
    };
  }, [dispatch]);

  const value = useMemo(
    () => ({
      dispatch: handleDispatch,
      state,
    }),
    [handleDispatch, state],
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
