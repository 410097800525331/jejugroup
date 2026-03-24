import { createContext, Dispatch, ReactNode, useContext, useMemo, useReducer } from "react";
import { ShellAction, ShellState, WishlistItem } from "@runtime/types";

const parseWishlist = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem("jeju_wishlist") ?? "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const parseCurrency = (): ShellState["currency"] => {
  const raw = localStorage.getItem("jeju_fab_currency");
  return raw === "USD" ? "USD" : "KRW";
};

const parseLanguage = (): ShellState["language"] => {
  const raw = localStorage.getItem("jeju_fab_lang");
  return raw === "en" ? "en" : "ko";
};

const initialState = (): ShellState => ({
  currency: parseCurrency(),
  language: parseLanguage(),
  wishlist: parseWishlist(),
  drawerOpen: false,
  chatbotOpen: false,
  weatherOpen: false
});

const nextBoolean = (current: boolean, requested?: boolean): boolean =>
  typeof requested === "boolean" ? requested : !current;

const reducer = (state: ShellState, action: ShellAction): ShellState => {
  switch (action.type) {
    case "SET_CURRENCY": {
      return { ...state, currency: action.payload };
    }
    case "SET_LANGUAGE": {
      return { ...state, language: action.payload };
    }
    case "SET_WISHLIST": {
      return { ...state, wishlist: [...action.payload] };
    }
    case "TOGGLE_DRAWER": {
      return { ...state, drawerOpen: nextBoolean(state.drawerOpen, action.payload) };
    }
    case "TOGGLE_CHATBOT": {
      return { ...state, chatbotOpen: nextBoolean(state.chatbotOpen, action.payload) };
    }
    case "TOGGLE_WEATHER": {
      return { ...state, weatherOpen: nextBoolean(state.weatherOpen, action.payload) };
    }
    default: {
      return state;
    }
  }
};

interface ShellContextValue {
  state: ShellState;
  dispatch: Dispatch<ShellAction>;
}

const ShellStateContext = createContext<ShellContextValue | null>(null);

interface ShellStateProviderProps {
  children: ReactNode;
}

export const ShellStateProvider = ({ children }: ShellStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return <ShellStateContext.Provider value={value}>{children}</ShellStateContext.Provider>;
};

export const useShellState = (): ShellContextValue => {
  const context = useContext(ShellStateContext);
  if (!context) {
    throw new Error("useShellState must be used under ShellStateProvider");
  }
  return context;
};
