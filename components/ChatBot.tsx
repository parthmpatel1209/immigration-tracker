"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Loader2, X } from "lucide-react";
import styles from "./ChatBot.module.css";

type Message = { role: "user" | "bot" | "error"; text: string };

/* ---------- Message Components ---------- */
const UserMessage = ({ text }: { text: string }) => (
  <div className={styles.messageWrapper}>
    <div className={styles.userMessage}>{text}</div>
  </div>
);

const BotMessage = ({ text }: { text: string }) => (
  <div className={styles.messageWrapper}>
    <div className={styles.botMessage}>{text}</div>
  </div>
);

const ErrorMessage = ({ text }: { text: string }) => (
  <div className={styles.errorMessage}>{text}</div>
);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "How does Express Entry work?",
    "What is a PNP and how do I apply?",
    "Which sector is most popular for obtaining PR in Canada?",
    "What are the requirements for a study permit?",
    "How long does PR processing take?",
    "Can learning French help me get PR in Canada?",
  ];

  /* ---------- Auto-scroll ---------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- Toggle animation ---------- */
  const toggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  /* ---------- Send message ---------- */
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "error", text: data.error || "Sorry, something went wrong." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", text: "Network error. Try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Suggestion click ---------- */
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const sendBtn = document.querySelector(
        `.${styles.sendBtn}`
      ) as HTMLButtonElement;
      if (sendBtn && !sendBtn.disabled) sendBtn.click();
    }, 300);
  };

  return (
    <>
      {/* Floating toggle */}
      <button onClick={toggle} className={styles.toggleBtn}>
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`${styles.container} ${styles.chatWindow} ${
            isClosing ? styles.closing : ""
          }`}
        >
          <div className={styles.header}>
            <span>Canadian Immigration Assistant</span>
            <button
              onClick={toggle}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.18s ease",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              className="dark:hover:bg-white/28"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className={styles.messages}>
            {messages.length === 0 ? (
              <div className={styles.suggestionsContainer}>
                <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
                  <span className="flex flex-wrap items-center justify-center gap-x-1.5">
                    <span className="font-semibold">🤖 AI Chatbot Notice:</span>
                    <span>
                      I provide estimates based on public data. Replies may be
                      incorrect or outdated.
                      <strong className="underline font-bold">
                        {" "}
                        Always confirm with{" "}
                        <a
                          href="https://www.canada.ca/en/immigration-refugees-citizenship.html"
                          target="_blank"
                          className="hover:text-amber-700"
                        >
                          IRCC
                        </a>{" "}
                        or a licensed RCIC.
                      </strong>
                    </span>
                  </span>
                </div>
                <p className={styles.welcome2}>
                  Ask about Express Entry, PNPs, work permits, etc.
                </p>

                <div className={styles.suggestions}>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className={styles.suggestionBtn}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => {
                  if (m.role === "user")
                    return <UserMessage key={i} text={m.text} />;
                  if (m.role === "bot")
                    return <BotMessage key={i} text={m.text} />;
                  return <ErrorMessage key={i} text={m.text} />;
                })}

                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking…</span>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputBar}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Ask a question..."
              className={styles.input}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={styles.sendBtn}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
