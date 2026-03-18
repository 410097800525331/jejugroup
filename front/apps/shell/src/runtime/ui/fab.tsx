import { createRoot, Root } from "react-dom/client";
import FABContainer from "@front-fab/FABContainer";
import { ShellStateProvider } from "@runtime/context/ShellStateContext";

let fabRoot: Root | null = null;

interface FabStateBridge {
  currency: "KRW" | "USD";
  language: "ko" | "en";
  wishlist: Array<Record<string, unknown>>;
  setCurrencyAndLang: (currency: "KRW" | "USD", language: "ko" | "en") => void;
  addToWishlist: (item: Record<string, unknown>) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

const getCurrency = (): "KRW" | "USD" => {
  return localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW";
};

const getLanguage = (): "ko" | "en" => {
  return localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
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

const emitFabEvents = (currency: "KRW" | "USD", language: "ko" | "en", wishlist: Array<Record<string, unknown>>) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: currency }));
  document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: language }));
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
      fabState.language = language;
      localStorage.setItem("jeju_fab_currency", currency);
      localStorage.setItem("jeju_fab_lang", language);
      emitFabEvents(currency, language, fabState.wishlist);
    },
    addToWishlist: (item) => {
      const wishlist = [...fabState.wishlist];
      const currentId = Number(item.id);
      const index = wishlist.findIndex((entry) => Number(entry.id) === currentId);
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
      const wishlist = fabState.wishlist.filter((entry) => Number(entry.id) !== id);
      fabState.wishlist = wishlist;
      localStorage.setItem("jeju_wishlist", JSON.stringify(wishlist));
      emitFabEvents(fabState.currency, fabState.language, wishlist);
    },
    isInWishlist: (id) => {
      return fabState.wishlist.some((entry) => Number(entry.id) === id);
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
