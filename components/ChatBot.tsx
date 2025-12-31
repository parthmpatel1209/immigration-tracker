"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Send, MessageCircle, X, Sparkles, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { getSuggestions } from "@/utils/rag";
import styles from "./ChatBot.module.css";

type Message = {
  role: "user" | "bot" | "error" | "typing";
  text: string;
  feedback?: "helpful" | "not-helpful" | null;
};

/** User message bubble component */
const UserMessage = ({ text }: { text: string }) => (
  <div className={styles.messageWrapper}>
    <div className={styles.userMessage}>{text}</div>
  </div>
);

/** Bot message bubble with feedback buttons */
const BotMessage = ({
  text,
  messageIndex,
  onFeedback,
  isComplete = true
}: {
  text: string;
  messageIndex: number;
  onFeedback: (index: number, type: "helpful" | "not-helpful") => void;
  isComplete?: boolean;
}) => {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Show feedback buttons 500ms after message completion
  useEffect(() => {
    if (isComplete && text) {
      const timer = setTimeout(() => setShowFeedback(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, text]);

  const handleFeedback = (type: "helpful" | "not-helpful") => {
    setFeedback(type);
    onFeedback(messageIndex, type);
  };

  return (
    <div className={styles.messageWrapper}>
      <div className={styles.botMessage}>
        {text}
        <div className={`${styles.feedbackButtons} ${showFeedback ? styles.show : ""}`}>
          <button
            className={`${styles.feedbackBtn} ${feedback === "helpful" ? `${styles.active} ${styles.helpful}` : ""}`}
            onClick={() => handleFeedback("helpful")}
            title="Helpful"
          >
            <ThumbsUp size={12} />
            <span>Helpful</span>
          </button>
          <button
            className={`${styles.feedbackBtn} ${feedback === "not-helpful" ? `${styles.active} ${styles.notHelpful}` : ""}`}
            onClick={() => handleFeedback("not-helpful")}
            title="Not helpful"
          >
            <ThumbsDown size={12} />
            <span>Not helpful</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorMessage = ({ text }: { text: string }) => (
  <div className={styles.errorMessage}>{text}</div>
);

const TypingIndicator = () => (
  <div className={styles.messageWrapper}>
    <div className={styles.botMessage}>
      <div className={styles.typingIndicator}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([
    "What is Express Entry and how does it work?",
    "How can I improve my CRS score?",
    "What are the language test requirements?",
    "Tell me about Provincial Nominee Programs",
    "Can I work while studying in Canada?",
    "What is the processing time for PR?",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Track user feedback for analytics */
  const handleFeedback = (messageIndex: number, type: "helpful" | "not-helpful") => {
    console.log(`Message ${messageIndex} marked as ${type}`);
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === messageIndex ? { ...msg, feedback: type } : msg
      )
    );
  };

  /** Auto-scroll to latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Update suggestions based on last bot message */
  useEffect(() => {
    const lastBotMessage = messages
      .filter((m) => m.role === "bot")
      .pop();

    if (lastBotMessage) {
      const newSuggestions = getSuggestions(lastBotMessage.text);
      setDynamicSuggestions(newSuggestions);
    }
  }, [messages]);

  /** Toggle chat window with animation */
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

  /** Send message and handle streaming response */
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    // Add typing indicator
    setMessages((prev) => [...prev, { role: "typing", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages, // Send conversation history
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // Handle streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let botReply = "";
      let hasBotMessage = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  botReply += parsed.content;

                  // Create or update bot message
                  setMessages((prev) => {
                    const filtered = prev.filter((m) => m.role !== "typing");

                    // Check if we already have a bot message
                    const lastMsg = filtered[filtered.length - 1];
                    if (lastMsg && lastMsg.role === "bot") {
                      // Update existing bot message
                      const newMessages = [...filtered];
                      newMessages[newMessages.length - 1] = {
                        role: "bot",
                        text: botReply,
                      };
                      return newMessages;
                    } else {
                      // Create new bot message
                      return [...filtered, { role: "bot", text: botReply }];
                    }
                  });

                  hasBotMessage = true;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // If no reply was received, show error
      if (!botReply || !hasBotMessage) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.role !== "typing" && !(m.role === "bot" && !m.text));
          return [
            ...filtered,
            { role: "error", text: "No response received. Please try again." },
          ];
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.role !== "typing" && !(m.role === "bot" && !m.text));
        return [
          ...filtered,
          { role: "error", text: "Network error. Please try again later." },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };


  /** Handle suggestion button click */
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => sendMessage(), 100);
  };

  /* ------------------------------------------------------------- */
  /* MOUNT CHECK + PORTAL */
  /* ------------------------------------------------------------- */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating toggle */}
      <button onClick={toggle} className={styles.toggleBtn}>
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`${styles.container} ${styles.chatWindow} ${isClosing ? styles.closing : ""
            }`}
        >
          <div className={styles.header}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Canadian Immigration Assistant</span>
            </div>
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
                      Powered by Mistral 7B with RAG. Responses are based on IRCC documents.
                      <strong className="underline font-bold">
                        {" "}
                        Always verify with{" "}
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
                  Ask about Express Entry, PNPs, work permits, study permits, and more!
                </p>

                <div className={styles.suggestions}>
                  {dynamicSuggestions.map((s, i) => (
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
                    return (
                      <BotMessage
                        key={i}
                        text={m.text}
                        messageIndex={i}
                        onFeedback={handleFeedback}
                      />
                    );
                  if (m.role === "typing")
                    return <TypingIndicator key={i} />;
                  return <ErrorMessage key={i} text={m.text} />;
                })}

                {/* Dynamic suggestions after conversation */}
                {!isLoading && messages.length > 0 && (
                  <div className={styles.suggestions} style={{ marginTop: "1rem" }}>
                    {dynamicSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className={styles.suggestionBtn}
                      >
                        {s}
                      </button>
                    ))}
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
    </>,
    document.body
  );
}
