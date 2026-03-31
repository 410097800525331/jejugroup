import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./chatbot-style.css";

export type ChatbotLanguage = "ko" | "en";

interface MessageItem {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: ChatbotLanguage;
  onLanguageChange: (language: ChatbotLanguage) => void;
}

type ChatApiResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: unknown;
      }>;
    };
  }>;
};

const CHAT_API_PATH = "/api/chat";

const createWelcomeText = (language: ChatbotLanguage) => {
  return language === "en" 
    ? "Welcome to Jeju Group. How can I assist you today?" 
    : "안녕하세요. 제주그룹 도우미입니다.\n여행의 모든 고민을 무엇이든 말씀해 주세요. 😊";
};

const readFailureMessage = (payload: unknown): string | null => {
  if (typeof payload === "string") {
    return payload.trim() || null;
  }

  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const directFields = [record.message, record.detail, record.errorMessage, record.reason];

  for (const field of directFields) {
    if (typeof field === "string" && field.trim()) {
      return field.trim();
    }
  }

  const error = record.error;
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (typeof error === "object" && error !== null) {
    const nested = error as Record<string, unknown>;
    const nestedFields = [nested.message, nested.detail, nested.errorMessage, nested.reason];

    for (const field of nestedFields) {
      if (typeof field === "string" && field.trim()) {
        return field.trim();
      }
    }
  }

  return null;
};

const extractFailureMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as unknown;
    return readFailureMessage(payload);
  } catch {
    return null;
  }
};

const extractChatbotReply = (data: ChatApiResponse) => {
  const openAiMessage = data.choices?.[0]?.message?.content;
  if (typeof openAiMessage === "string" && openAiMessage.trim()) {
    return openAiMessage.trim();
  }

  const geminiParts = data.candidates?.[0]?.content?.parts ?? [];
  const geminiMessage = geminiParts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .filter((text): text is string => Boolean(text))
    .join("\n")
    .trim();

  return geminiMessage || null;
};

export const ChatbotPanel = ({ isOpen, onClose, language, onLanguageChange }: ChatbotPanelProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"online" | "offline" | "error" | "checking">("checking");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(CHAT_API_PATH, {
        method: "GET",
        cache: "no-cache",
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) { 
        setStatus("online");
      } else {
        // Server is reached but returns something like 404 or 500
        setStatus("error");
      }
    } catch (_error) {
      // Network is totally down or unreachable
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    checkStatus().catch(() => {});
    const intervalId = setInterval(() => {
      checkStatus().catch(() => {});
    }, 60000); // 1 minute interval

    return () => clearInterval(intervalId);
  }, [checkStatus]);

  useEffect(() => {
    const initialMessage: MessageItem = {
      id: Date.now(),
      type: "bot",
      content: createWelcomeText(language),
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<ChatbotLanguage>;
      if (customEvent.detail === "ko" || customEvent.detail === "en") {
        onLanguageChange(customEvent.detail);
      }
    };

    document.addEventListener("fabLanguageChanged", listener);
    return () => {
      document.removeEventListener("fabLanguageChanged", listener);
    };
  }, [onLanguageChange]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const addMessage = useCallback((type: "user" | "bot", content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + prev.length + 1,
        type,
        content,
        timestamp: new Date()
      }
    ]);
  }, []);

  const historyPayload = useMemo(
    () => messages.map((message) => ({ role: message.type === "user" ? "user" : "assistant", content: message.content })),
    [messages]
  );

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || loading) {
      return;
    }

    addMessage("user", content);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(CHAT_API_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: language === "en" ? "You are Jeju Group Assistant" : "당신은 제주그룹 안내 도우미입니다."
            },
            ...historyPayload,
            {
              role: "user",
              content
            }
          ]
        })
      });

      if (!response.ok) {
        const failureMessage = (await extractFailureMessage(response)) ?? `Chat API failed: ${response.status}`;
        throw new Error(failureMessage);
      }

      const data = (await response.json()) as ChatApiResponse;
      const botMessage = extractChatbotReply(data) ?? "응답 처리 실패";
      addMessage("bot", String(botMessage));
    } catch (error) {
      addMessage("bot", `오류가 발생했습니다: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [addMessage, historyPayload, input, language, loading]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage().catch(() => {});
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage().catch(() => {});
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "active" : ""}`}>
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <div className={`chatbot-status-dot ${status}`} title={`API Server: ${status}`} />
          <h3 className="chatbot-header-title">{language === "en" ? "Jeju Group Assistant" : "제주그룹 도우미"}</h3>
        </div>
        <button className="chatbot-close-btn" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="chatbot-messages" ref={containerRef}>
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-bubble">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        {loading ? (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <form className="chatbot-input-area" onSubmit={onSubmit}>
        <div className="chatbot-input-wrapper">
          <input
            className="chatbot-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={language === "en" ? "Type your message..." : "무엇이든 물어보세요"}
          />
          <button className="chatbot-send-btn" type="submit" disabled={loading || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
