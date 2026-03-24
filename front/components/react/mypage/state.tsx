import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from "react";
import { applyDashboardSnapshot, createDashboardFallbackSnapshot, normalizeDashboardSnapshot } from "@front-components/mypage/data";
import type { BookingItem, BookingType, DashboardSnapshot, ItineraryCompanion, ItineraryItem, StatItem, SupportItem, TravelEvent, UserProfile } from "./types";
import {
  MYPAGE_DASHBOARD_MOCK_EVENT_NAME,
  MYPAGE_DASHBOARD_MOCK_STORAGE_PREFIX,
  mergeDashboardSources,
  readAccountDashboardMock,
  readAccountDashboardMockByAccountKey,
} from "./mockAccountDashboardStore";
import { normalizeTravelEventsInput } from "./data";

type BookingFilter = "all" | BookingType;

export interface DashboardState {
  bookings: BookingItem[];
  filter: BookingFilter;
  itinerary: ItineraryItem[];
  linkedCompanions: ItineraryCompanion[];
  profile: UserProfile;
  stats: StatItem[];
  supportItems: SupportItem[];
  travelEvents: TravelEvent[];
}

type DashboardAction =
  | { type: "HYDRATE_DASHBOARD"; payload: DashboardSnapshot }
  | { type: "PATCH_PROFILE"; payload: Partial<UserProfile> }
  | { type: "SET_LINKED_COMPANIONS"; payload: ItineraryCompanion[] }
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
    linkedCompanions: snapshot.linkedCompanions,
    profile: snapshot.profile,
    stats: snapshot.stats,
    supportItems: snapshot.supportItems,
    travelEvents: snapshot.travelEvents,
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
        linkedCompanions: action.payload.linkedCompanions.map((companion) => ({ ...companion })),
        profile: {
          ...action.payload.profile,
          memberships: [...action.payload.profile.memberships],
          passport: action.payload.profile.passport ? { ...action.payload.profile.passport } : undefined,
        },
        stats: action.payload.stats.map((stat) => ({ ...stat })),
        supportItems: action.payload.supportItems.map((item) => ({ ...item })),
        travelEvents: action.payload.travelEvents.map((event) => ({ ...event })),
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
    case "SET_LINKED_COMPANIONS":
      return {
        ...state,
        linkedCompanions: action.payload.map((companion) => ({ ...companion })),
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
  linkedCompanions: state.linkedCompanions,
  profile: state.profile,
  stats: state.stats,
  supportItems: state.supportItems,
  travelEvents: state.travelEvents,
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

const mergeTravelEventSources = (session: unknown) => {
  const baseSource = mergeDashboardSources(session, readAccountDashboardMock(session));
  const baseSnapshot = normalizeDashboardSnapshot(baseSource);

  if (baseSnapshot.linkedCompanions.length === 0) {
    return normalizeDashboardSnapshot(baseSource);
  }

  const aggregatedTravelEvents = [
    ...baseSnapshot.travelEvents,
    ...baseSnapshot.linkedCompanions.flatMap((companion) => {
      const companionMock = readAccountDashboardMockByAccountKey(companion.id);
      if (!companionMock || !("travelEvents" in companionMock)) {
        return [];
      }

      return normalizeTravelEventsInput(companionMock.travelEvents).map((event) => ({
        ...event,
        ownerId: event.ownerId || companion.id,
        ownerName: event.ownerName || companion.name,
      }));
    }),
  ];

  return normalizeDashboardSnapshot(
    mergeDashboardSources(baseSource, {
      linkedCompanions: baseSnapshot.linkedCompanions,
      travelEvents: aggregatedTravelEvents,
    }),
  );
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [authResolved, setAuthResolved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleDispatch = (action: DashboardAction) => {
    if (action.type === "HYDRATE_DASHBOARD") {
      applyDashboardSnapshot(action.payload);
    } else if (action.type === "PATCH_PROFILE") {
      applyDashboardSnapshot({
        bookings: state.bookings,
        itinerary: state.itinerary,
        linkedCompanions: state.linkedCompanions,
        profile: mergeProfilePatch(state.profile, action.payload),
        stats: state.stats,
        supportItems: state.supportItems,
        travelEvents: state.travelEvents,
      });
    }

    dispatch(action);
  };

  useEffect(() => {
    applyDashboardSnapshot(snapshotFromState(state));
  }, [state.bookings, state.itinerary, state.linkedCompanions, state.profile, state.stats, state.supportItems, state.travelEvents]);

  useEffect(() => {
    let active = true;

    const hydrate = async (source?: unknown | null) => {
      const resolvedSession = source === undefined ? await resolveSession() : source;
      if (!resolvedSession) {
        if (!active) {
          return;
        }

        setIsAuthenticated(false);
        setAuthResolved(true);
        return;
      }

      const snapshot = mergeTravelEventSources(resolvedSession);

      if (!active) {
        return;
      }

      setIsAuthenticated(true);
      setAuthResolved(true);
      applyDashboardSnapshot(snapshot);
      dispatch({ type: "HYDRATE_DASHBOARD", payload: snapshot });
    };

    void hydrate();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SESSION_STORAGE_KEY) {
        void hydrate(parseSessionPayload(event.newValue));
        return;
      }

      if (!event.key?.startsWith(MYPAGE_DASHBOARD_MOCK_STORAGE_PREFIX)) {
        return;
      }

      void hydrate();
    };

    const handleSessionUpdate = (event: Event) => {
      const detail = event instanceof CustomEvent ? (event.detail as { session?: unknown | null } | null) : null;
      void hydrate(detail?.session ?? null);
    };

    const handleMockDashboardUpdate = () => {
      void hydrate();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(SESSION_EVENT_NAME, handleSessionUpdate as EventListener);
    window.addEventListener(MYPAGE_DASHBOARD_MOCK_EVENT_NAME, handleMockDashboardUpdate as EventListener);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SESSION_EVENT_NAME, handleSessionUpdate as EventListener);
      window.removeEventListener(MYPAGE_DASHBOARD_MOCK_EVENT_NAME, handleMockDashboardUpdate as EventListener);
    };
  }, [dispatch]);

  const value = useMemo(
    () => ({
      dispatch: handleDispatch,
      state,
    }),
    [handleDispatch, state],
  );

  if (!authResolved || !isAuthenticated) {
    return (
      <div className="mypage-auth-empty-state soft-radius" role="status" aria-live="polite">
        <div className="mypage-auth-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
              d="M12 3.75 21 19.5a1.2 1.2 0 0 1-1.04 1.8H4.04A1.2 1.2 0 0 1 3 19.5L12 3.75Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M12 9v5.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="17.25" r="1.1" fill="currentColor" />
          </svg>
        </div>
        <p className="mypage-auth-empty-text">로그인을 해주세요.</p>
      </div>
    );
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardState = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardState must be used within DashboardProvider");
  }

  return context;
};
