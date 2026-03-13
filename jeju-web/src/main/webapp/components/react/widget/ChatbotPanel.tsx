import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const createWelcomeText = (language: ChatbotLanguage) => {
  return language === "en" ? "Hello, I am your Jeju Group assistant" : "안녕 나는 제주그룹 안내 도우미";
};

export const ChatbotPanel = ({ isOpen, onClose, language, onLanguageChange }: ChatbotPanelProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      const response = await fetch("https://jejugroup.alwaysdata.net/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: language === "en" ? "You are Jeju Group assistant" : "너는 제주그룹 안내 도우미"
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
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = data?.choices?.[0]?.message?.content ?? "응답 처리 실패";
      addMessage("bot", String(botMessage));
    } catch (error) {
      addMessage("bot", `오류 상태: ${(error as Error).message}`);
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
        <h3>{language === "en" ? "Jeju Chatbot" : "제주 챗봇"}</h3>
        <button className="chatbot-close-btn" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="chatbot-messages" ref={containerRef}>
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-bubble">{message.content}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="message bot">
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        ) : null}
      </div>

      <form className="chatbot-input-area" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={language === "en" ? "Type a message" : "메시지 입력"}
        />
        <button type="submit" disabled={loading}>
          {language === "en" ? "Send" : "전송"}
        </button>
      </form>
    </div>
  );
};
