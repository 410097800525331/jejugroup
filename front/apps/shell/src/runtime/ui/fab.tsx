import { createRoot, Root } from "react-dom/client";
import FABContainer from "@front-fab/FABContainer";
import { ShellStateProvider } from "@runtime/context/ShellStateContext";

let fabRoot: Root | null = null;

type FabLanguage = "ko" | "en";

interface FabStateBridge {
  currency: "KRW" | "USD";
  language: FabLanguage;
  wishlist: Array<Record<string, unknown>>;
  setCurrencyAndLang: (currency: "KRW" | "USD", language: FabLanguage) => void;
  addToWishlist: (item: Record<string, unknown>) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}

interface FrontI18nBridge {
  getCurrentLang?: () => FabLanguage;
  resolveCurrentLang?: () => FabLanguage;
  setCurrentLang?: (nextLang: FabLanguage, options?: { source?: string; persist?: boolean }) => FabLanguage;
  subscribeLanguageChange?: (
    listener: (payload: {
      lang?: string;
      previousLang?: string;
      source?: string;
      external?: boolean;
    }) => void
  ) => () => void;
}

const normalizeWishlistId = (value: unknown) => {
  return String(value ?? "").trim();
};

const getFrontI18nBridge = (): FrontI18nBridge | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { frontI18n?: FrontI18nBridge }).frontI18n ?? null;
};

const normalizeLanguage = (value: unknown): FabLanguage | null => {
  return value === "en" || value === "ko" ? value : null;
};

const readFallbackLanguage = (): FabLanguage => {
  try {
    const raw = localStorage.getItem("jeju_fab_lang");
    return raw === "en" ? "en" : "ko";
  } catch (_error) {
    return "ko";
  }
};

const resolveSharedLanguage = (): FabLanguage => {
  const bridge = getFrontI18nBridge();
  const bridgeLanguage = normalizeLanguage(bridge?.getCurrentLang?.() ?? bridge?.resolveCurrentLang?.());

  return bridgeLanguage ?? readFallbackLanguage();
};

const persistLegacyLanguage = (language: FabLanguage) => {
  try {
    localStorage.setItem("jeju_lang", language);
    localStorage.setItem("front.lang", language);
    localStorage.setItem("jeju_fab_lang", language);
  } catch (_error) {
    // 저장 실패는 무시한다.
  }
};

const emitLegacyLanguageEvents = (language: FabLanguage) => {
  if (typeof document === "undefined") {
    return;
  }

  document.dispatchEvent(new CustomEvent("languageChanged", { detail: language }));
  document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: language }));
  document.dispatchEvent(new CustomEvent("front:i18n-change", { detail: { lang: language, source: "fab:fallback" } }));
};

const subscribeSharedLanguage = (listener: (language: FabLanguage) => void) => {
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

const setSharedLanguage = (language: FabLanguage, source: string): FabLanguage => {
  const resolvedLanguage = normalizeLanguage(language) ?? "ko";
  const bridge = getFrontI18nBridge();

  if (bridge?.setCurrentLang) {
    return bridge.setCurrentLang(resolvedLanguage, { source }) ?? resolvedLanguage;
  }

  persistLegacyLanguage(resolvedLanguage);
  emitLegacyLanguageEvents(resolvedLanguage);
  return resolvedLanguage;
};

const getCurrency = (): "KRW" | "USD" => {
  return localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW";
};

const getLanguage = (): "ko" | "en" => {
  return resolveSharedLanguage();
};

const getWishlist = () => {
  try {
    const raw = localStorage.getItem("jeju_wishlist") ?? "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const emitFabEvents = (
  currency: "KRW" | "USD",
  language: FabLanguage,
  wishlist: Array<Record<string, unknown>>,
  options?: { includeLanguage?: boolean }
) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: currency }));
  if (options?.includeLanguage !== false) {
    document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: language }));
  }
  document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: wishlist }));
};

const installFabStateBridge = () => {
  if (window.FABState) {
    return;
  }

  const fabState: FabStateBridge = {
    currency: getCurrency(),
    language: getLanguage(),
    wishlist: getWishlist(),
    setCurrencyAndLang: (currency, language) => {
      fabState.currency = currency;
      fabState.language = setSharedLanguage(language, "fab:setCurrencyAndLang");
      localStorage.setItem("jeju_fab_currency", currency);
      emitFabEvents(currency, fabState.language, fabState.wishlist, { includeLanguage: false });
    },
    addToWishlist: (item) => {
      const wishlist = [...fabState.wishlist];
      const currentId = normalizeWishlistId(item.id);
      if (!currentId) {
        return;
      }

      const index = wishlist.findIndex((entry) => normalizeWishlistId(entry.id) === currentId);
      if (index === -1) {
        wishlist.push(item);
      } else {
        wishlist.splice(index, 1);
      }

      fabState.wishlist = wishlist;
      localStorage.setItem("jeju_wishlist", JSON.stringify(wishlist));
      emitFabEvents(fabState.currency, fabState.language, wishlist);
    },
    removeFromWishlist: (id) => {
      const normalizedId = normalizeWishlistId(id);
      const wishlist = fabState.wishlist.filter((entry) => normalizeWishlistId(entry.id) !== normalizedId);
      fabState.wishlist = wishlist;
      localStorage.setItem("jeju_wishlist", JSON.stringify(wishlist));
      emitFabEvents(fabState.currency, fabState.language, wishlist);
    },
    isInWishlist: (id) => {
      const normalizedId = normalizeWishlistId(id);
      return fabState.wishlist.some((entry) => normalizeWishlistId(entry.id) === normalizedId);
    }
  };

  window.FABState = fabState as unknown as typeof window.FABState;

  document.addEventListener("fabCurrencyChanged", (event) => {
    const customEvent = event as CustomEvent<"KRW" | "USD">;
    fabState.currency = customEvent.detail === "USD" ? "USD" : "KRW";
  });

  document.addEventListener("fabLanguageChanged", (event) => {
    const customEvent = event as CustomEvent<"ko" | "en">;
    fabState.language = customEvent.detail === "en" ? "en" : "ko";
  });

  document.addEventListener("fabWishlistUpdated", (event) => {
    const customEvent = event as CustomEvent<Array<Record<string, unknown>>>;
    fabState.wishlist = Array.isArray(customEvent.detail) ? [...customEvent.detail] : [];
  });

  subscribeSharedLanguage((language) => {
    fabState.language = language;
  });

  emitFabEvents(fabState.currency, fabState.language, fabState.wishlist);
};

export const setupLegacyFab = () => {
  const rootId = "jeju-fab-root";
  let rootElement = document.getElementById(rootId);

  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = rootId;
    document.body.appendChild(rootElement);
  }

  if (!fabRoot) {
    fabRoot = createRoot(rootElement);
  }

  fabRoot.render(
    <ShellStateProvider>
      <FABContainer />
    </ShellStateProvider>
  );

  installFabStateBridge();
};
