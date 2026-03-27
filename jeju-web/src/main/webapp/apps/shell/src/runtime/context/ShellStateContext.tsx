import { createContext, Dispatch, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";
import { ShellAction, ShellState, WishlistItem } from "@runtime/types";

type ShellLanguage = ShellState["language"];

interface FrontI18nBridge {
  getCurrentLang?: () => ShellLanguage;
  resolveCurrentLang?: () => ShellLanguage;
  subscribeLanguageChange?: (
    listener: (payload: {
      lang?: string;
      previousLang?: string;
      source?: string;
      external?: boolean;
    }) => void
  ) => () => void;
}

const getFrontI18nBridge = (): FrontI18nBridge | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { frontI18n?: FrontI18nBridge }).frontI18n ?? null;
};

const normalizeLanguage = (value: unknown): ShellLanguage | null => {
  return value === "en" || value === "ko" ? value : null;
};

const readFallbackLanguage = (): ShellLanguage => {
  try {
    const raw = localStorage.getItem("jeju_fab_lang");
    return raw === "en" ? "en" : "ko";
  } catch (_error) {
    return "ko";
  }
};

const resolveLanguage = (): ShellLanguage => {
  const bridge = getFrontI18nBridge();
  const bridgeLanguage = normalizeLanguage(bridge?.getCurrentLang?.() ?? bridge?.resolveCurrentLang?.());

  return bridgeLanguage ?? readFallbackLanguage();
};

const subscribeLanguage = (listener: (language: ShellLanguage) => void) => {
  const bridge = getFrontI18nBridge();
  if (bridge?.subscribeLanguageChange) {
    return bridge.subscribeLanguageChange((payload) => {
      const nextLanguage = normalizeLanguage(payload.lang);
      if (nextLanguage) {
        listener(nextLanguage);
      }
    });
  }

  if (typeof document === "undefined") {
    return () => {};
  }

  const handleLanguageChange = (event: Event) => {
    const customEvent = event as CustomEvent<unknown>;
    const detail = customEvent.detail;
    const nextLanguage = normalizeLanguage(
      typeof detail === "string"
        ? detail
        : typeof detail === "object" && detail
          ? (detail as { lang?: unknown; currentLang?: unknown; value?: unknown }).lang ??
            (detail as { lang?: unknown; currentLang?: unknown; value?: unknown }).currentLang ??
            (detail as { lang?: unknown; currentLang?: unknown; value?: unknown }).value
          : null
    );

    if (nextLanguage) {
      listener(nextLanguage);
    }
  };

  document.addEventListener("languageChanged", handleLanguageChange);
  document.addEventListener("fabLanguageChanged", handleLanguageChange);
  document.addEventListener("front:i18n-change", handleLanguageChange);

  return () => {
    document.removeEventListener("languageChanged", handleLanguageChange);
    document.removeEventListener("fabLanguageChanged", handleLanguageChange);
    document.removeEventListener("front:i18n-change", handleLanguageChange);
  };
};

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
  return resolveLanguage();
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

  useEffect(() => {
    const unsubscribe = subscribeLanguage((language) => {
      if (language !== state.language) {
        dispatch({ type: "SET_LANGUAGE", payload: language });
      }
    });

    const currentLanguage = resolveLanguage();
    if (currentLanguage !== state.language) {
      dispatch({ type: "SET_LANGUAGE", payload: currentLanguage });
    }

    return unsubscribe;
  }, [dispatch, state.language]);

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
