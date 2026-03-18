export const getAppRoot = (): string => {
  const runtimeRoot = new URL("../../", import.meta.url).href;

  if (window.__JEJU_ROUTE_NAVIGATOR__?.appRoot) {
    return new URL(window.__JEJU_ROUTE_NAVIGATOR__.appRoot, window.location.href).href;
  }

  const script = document.currentScript as HTMLScriptElement | null;
  if (script?.src) {
    return new URL("../", script.src).href;
  }

  const scripts = Array.from(document.getElementsByTagName("script"));
  for (const scriptElement of scripts) {
    const source = scriptElement.src || scriptElement.getAttribute("src");
    if (!source) {
      continue;
    }

    if (source.includes("components/runtime/bootstrap.js") || source.includes("components/runtime/shell-runtime.js")) {
      return new URL("../../", source).href;
    }
  }

  return runtimeRoot;
};

export const resolveFromAppRoot = (resourcePath: string): string => {
  return new URL(resourcePath, getAppRoot()).href;
};

declare global {
  interface Window {
    __JEJU_ROUTE_NAVIGATOR__?: {
      appRoot?: string;
      homeUrl?: string;
      safeNavigate?: (targetUrl: string, reason?: string, options?: Record<string, unknown>) => void;
    };
    initHeader?: () => void;
    initFooter?: () => void;
    initMegaMenu?: () => void;
    initStaggerNav?: () => void;
    hotelChatbot?: {
      openChatbot: () => void;
      closeChatbot: () => void;
      toggleChatbot: () => void;
      updateLanguage: (lang: "ko" | "en") => void;
    };
    JJRangeCalendar?: {
      createRangeCalendar: (config?: Record<string, unknown>) => unknown;
    };
    FABState?: {
      currency: "KRW" | "USD";
      language: "ko" | "en";
      wishlist: Array<Record<string, unknown>>;
      setCurrencyAndLang: (currency: "KRW" | "USD", language: "ko" | "en") => void;
      addToWishlist: (item: Record<string, unknown>) => void;
      removeFromWishlist: (id: number) => void;
      isInWishlist: (id: number) => boolean;
    };
  }
}
