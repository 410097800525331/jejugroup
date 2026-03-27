import { createRoot, Root } from "react-dom/client";
import { ChatbotPanel, type ChatbotLanguage } from "@front-components/widget";

let chatbotRoot: Root | null = null;
let chatbotHost: HTMLElement | null = null;
let chatbotOpen = false;

interface FrontI18nBridge {
  getCurrentLang?: () => ChatbotLanguage;
  resolveCurrentLang?: () => ChatbotLanguage;
  setCurrentLang?: (nextLang: ChatbotLanguage, options?: { source?: string; persist?: boolean }) => ChatbotLanguage;
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

const normalizeLanguage = (value: unknown): ChatbotLanguage | null => {
  return value === "en" || value === "ko" ? value : null;
};

const readFallbackLanguage = (): ChatbotLanguage => {
  try {
    const raw = localStorage.getItem("jeju_fab_lang");
    return raw === "en" ? "en" : "ko";
  } catch (_error) {
    return "ko";
  }
};

const resolveSharedLanguage = (): ChatbotLanguage => {
  const bridge = getFrontI18nBridge();
  const bridgeLanguage = normalizeLanguage(bridge?.getCurrentLang?.() ?? bridge?.resolveCurrentLang?.());

  return bridgeLanguage ?? readFallbackLanguage();
};

const persistLegacyLanguage = (language: ChatbotLanguage) => {
  try {
    localStorage.setItem("jeju_lang", language);
    localStorage.setItem("front.lang", language);
    localStorage.setItem("jeju_fab_lang", language);
  } catch (_error) {
    // 저장 실패는 무시한다.
  }
};

const emitLegacyLanguageEvents = (language: ChatbotLanguage) => {
  if (typeof document === "undefined") {
    return;
  }

  document.dispatchEvent(new CustomEvent("languageChanged", { detail: language }));
  document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: language }));
  document.dispatchEvent(new CustomEvent("front:i18n-change", { detail: { lang: language, source: "chatbot:fallback" } }));
};

const subscribeSharedLanguage = (listener: (nextLanguage: ChatbotLanguage) => void) => {
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

const setSharedLanguage = (nextLanguage: ChatbotLanguage, source: string): ChatbotLanguage => {
  const resolvedLanguage = normalizeLanguage(nextLanguage) ?? "ko";
  const bridge = getFrontI18nBridge();

  if (bridge?.setCurrentLang) {
    return bridge.setCurrentLang(resolvedLanguage, { source }) ?? resolvedLanguage;
  }

  persistLegacyLanguage(resolvedLanguage);
  emitLegacyLanguageEvents(resolvedLanguage);
  return resolvedLanguage;
};

let language: ChatbotLanguage = resolveSharedLanguage();
let unsubscribeLanguage: (() => void) | null = null;

const rerender = () => {
  if (!chatbotRoot) {
    return;
  }

  chatbotRoot.render(
    <ChatbotPanel
      isOpen={chatbotOpen}
      onClose={() => {
        chatbotOpen = false;
        rerender();
      }}
      language={language}
      onLanguageChange={(nextLanguage) => {
        if (language === nextLanguage) {
          return;
        }

        language = nextLanguage;
        rerender();
      }}
    />
  );
};

const ensureHost = () => {
  if (chatbotHost) {
    return;
  }

  chatbotHost = document.getElementById("jeju-chatbot-root");
  if (!chatbotHost) {
    chatbotHost = document.createElement("div");
    chatbotHost.id = "jeju-chatbot-root";
    document.body.appendChild(chatbotHost);
  }

  chatbotRoot = createRoot(chatbotHost);
  rerender();
};

export const setupLegacyChatbot = () => {
  language = resolveSharedLanguage();
  ensureHost();

  if (!unsubscribeLanguage) {
    unsubscribeLanguage = subscribeSharedLanguage((nextLanguage) => {
      if (language !== nextLanguage) {
        language = nextLanguage;
        rerender();
      }
    });
  }

  rerender();

  window.hotelChatbot = {
    openChatbot: () => {
      chatbotOpen = true;
      rerender();
    },
    closeChatbot: () => {
      chatbotOpen = false;
      rerender();
    },
    toggleChatbot: () => {
      chatbotOpen = !chatbotOpen;
      rerender();
    },
    updateLanguage: (nextLanguage: ChatbotLanguage) => {
      if (language === nextLanguage) {
        return;
      }

      language = setSharedLanguage(nextLanguage, "chatbot:updateLanguage");
      rerender();
    }
  };
};
