"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";

export default function BubbleChat() {
  const [open, setOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showPresets, setShowPresets] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append,
  } = useChat({ api: "/api/chat" });

  // Автопрокрутка вниз
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Hide preset buttons after first user message
  useEffect(() => {
    if (messages.some((m) => m.role === "user")) {
      setShowPresets(false);
    }
  }, [messages]);

  return (
    <>
      {/* Bubble-кнопка */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-coral text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-neon transition text-3xl border-4 border-white"
        onClick={() => setOpen(true)}
        aria-label="Открыть чат"
        style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)" }}
      >
        💬
      </button>

      {/* Модалка (sheet) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-end z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed inset-0 bg-black/40 flex items-end justify-end z-50"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-t-3xl shadow-2xl p-6 w-full max-w-3xl mx-auto mb-0 flex flex-col gap-4 animate-fade-in"
              style={{ minHeight: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-bold text-lg text-charcoal mb-2 flex items-center justify-between">
                <span>Чат-бот</span>
                <button
                  className="text-coral text-2xl leading-none"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto  max-h-[60vh] scroll-smooth"
              >
                {messages.length === 0 && (
                  <div className="text-charcoal/60 text-sm mb-2">
                    <ReactMarkdown>
                      {`**Привет, я Vivi!** 🌱\n\nМожешь выбрать один из примеров или написать свой вопрос:`}
                    </ReactMarkdown>
                  </div>
                )}

                {messages
                  .filter((m) => m.role !== "system" && m.content?.trim() !== "")
                  .map((m, i) => (
                    <div
                      key={i}
                      className={`mb-2 ${
                        m.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block px-3 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words ${
                          m.role === "user"
                            ? "bg-mint text-charcoal"
                            : "bg-lemon text-charcoal"
                        }`}
                      >
                        <strong>{m.role === "user" ? "Вы" : "Vivi"}:</strong>{" "}
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="my-0.5">{children}</p>
                            ),
                          }}
                        >
                          {m.content.trim()}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                {isLoading && (
                  <div className="text-xs text-gray-400">Vivi печатает...</div>
                )}

                {error && (
                  <div className="text-red-500 text-xs mt-2">
                    Ошибка: {error.message}
                  </div>
                )}

                {/* Preset question buttons (hide after first user message) */}
                {showPresets && (
                  <div className="flex gap-2 mb-2">
                    {[
                      "Как улучшить сон?",
                      "Придумай легкий ужин",
                      "Дай совет для энергии",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="bg-mint text-charcoal px-3 py-1 rounded-full text-sm border border-mint hover:bg-lemon transition"
                        onClick={() => append({ role: "user", content: q })}
                        disabled={isLoading}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  className="px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-coral"
                  placeholder="Спроси у Vivi…"
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-coral text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                  disabled={isLoading || !input.trim()}
                >
                  ➤
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
