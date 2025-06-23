"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function BubbleChat() {
  const [open, setOpen] = useState(false);
  const exampleMessage = `**Привет!** Я чат-бот :wave:\n\n- Поддерживаю *markdown*\n- И emoji 😎\n\n> Просто напиши свой вопрос!`;

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
        <div className="fixed inset-0 bg-black/40 flex items-end justify-end z-50" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-t-3xl shadow-2xl p-6 w-full max-w-md mx-auto mb-0 flex flex-col gap-4 animate-fade-in"
            style={{ minHeight: 320 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="font-bold text-lg text-charcoal mb-2 flex items-center justify-between">
              <span>Чат-бот</span>
              <button className="text-coral text-2xl leading-none" onClick={() => setOpen(false)} aria-label="Закрыть">×</button>
            </div>
            <div className="flex-1 overflow-y-auto prose prose-sm">
              <ReactMarkdown>{exampleMessage}</ReactMarkdown>
            </div>
            <input
              className="mt-4 px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="Ваш вопрос..."
              disabled
            />
          </div>
        </div>
      )}
    </>
  );
} 