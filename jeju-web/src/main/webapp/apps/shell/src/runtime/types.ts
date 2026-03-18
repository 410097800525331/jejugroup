export type Currency = "KRW" | "USD";
export type Language = "ko" | "en";

export interface WishlistItem {
  id: number;
  name: string;
  image: string;
  location: string;
  price: string;
}

export interface ShellState {
  currency: Currency;
  language: Language;
  wishlist: WishlistItem[];
  drawerOpen: boolean;
  chatbotOpen: boolean;
  weatherOpen: boolean;
}

export type ShellAction =
  | { type: "SET_CURRENCY"; payload: Currency }
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_WISHLIST"; payload: WishlistItem[] }
  | { type: "TOGGLE_DRAWER"; payload?: boolean }
  | { type: "TOGGLE_CHATBOT"; payload?: boolean }
  | { type: "TOGGLE_WEATHER"; payload?: boolean };

export interface RuntimeBridge {
  mountMainShell: () => Promise<void>;
  mountHotelShell: () => Promise<void>;
  ensureHeaderBehavior: () => void;
  ensureFooterBehavior: () => void;
  ensureMegaMenuBehavior: () => void;
  ensureStaggerNavBehavior: () => void;
  openReservationDrawer: () => Promise<void>;
  closeReservationDrawer: () => void;
  setupLegacyFab: () => void;
  setupLegacyChatbot: () => void;
  setupWeatherWidget: () => void;
  createRangeCalendar: (config?: Record<string, unknown>) => unknown;
}
