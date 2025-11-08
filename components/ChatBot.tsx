"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import styles from "./ChatBot.module.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "bot" | "error"; text: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------- */
  /*  Auto-scroll to bottom when a new message arrives          */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------------------------------------------------- */
  /*  Graceful open/close animation                             */
  /* ---------------------------------------------------------- */
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

  /* ---------------------------------------------------------- */
  /*  Send message with 429 retry logic                         */
  /* ---------------------------------------------------------- */
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 3;

    while (true) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        });

        // ---- 429 Retry ----
        if (res.status === 429 && retryCount < maxRetries) {
          retryCount++;
          const delay = 1000 * 2 ** retryCount; // 2s, 4s, 8s
          setMessages((prev) => [
            ...prev,
            {
              role: "error",
              text: `Rate limited — retrying in ${delay / 1000}s…`,
            },
          ]);
          await new Promise((r) => setTimeout(r, delay));
          continue; // retry
        }

        const data = await res.json();

        if (data.error) {
          setMessages((prev) => [
            ...prev,
            {
              role: "error",
              text: data.error || "Sorry, something went wrong.",
            },
          ]);
        } else {
          setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        }
        break; // success
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: "error", text: "Network error. Try again later." },
        ]);
        break;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Floating toggle button – scoped with .chatBotRoot */}
      <button
        onClick={toggle}
        className={`${styles.toggleBtn} ${styles.chatBotRoot}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window – fully scoped */}
      {isOpen && (
        <div
          className={`${styles.container} ${styles.chatWindow} ${
            styles.chatBotRoot
          } ${isClosing ? styles.closing : ""}`}
        >
          <div className={styles.header}>Canadian Immigration Assistant</div>

          <div className={styles.messages}>
            {messages.length === 0 && (
              <p className={styles.welcome}>
                Ask about Express Entry, PNPs, work permits, etc.
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  m.role === "user"
                    ? styles["message.user"]
                    : m.role === "error"
                    ? styles["message.error"]
                    : styles["message.bot"]
                }`}
              >
                {m.text}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking…</span>
              </div>
            )}

            {/* Invisible anchor for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputBar}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={
                (e) => e.key === "Enter" && !e.shiftKey && sendMessage() // Fixed: only one quote
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
