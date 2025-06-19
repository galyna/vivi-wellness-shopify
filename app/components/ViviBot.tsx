"use client";
import React, { useState } from "react";

const ViviBot = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-coral text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-neon transition text-3xl"
        onClick={() => setOpen(true)}
        aria-label="Open ViviBot chat"
      >
        💬
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-end justify-end z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 m-8 w-full max-w-sm flex flex-col gap-4 animate-fade-in">
            <div className="font-bold text-lg text-charcoal mb-2">Hi! Need advice for today? Let&apos;s find a new habit together.</div>
            <div className="flex gap-2">
              <button className="bg-mint px-3 py-2 rounded-full font-accent text-charcoal hover:bg-lemon transition">Breakfast ideas</button>
              <button className="bg-mint px-3 py-2 rounded-full font-accent text-charcoal hover:bg-lemon transition">Mood boosters</button>
              <button className="bg-mint px-3 py-2 rounded-full font-accent text-charcoal hover:bg-lemon transition">Easy routine</button>
            </div>
            <button className="mt-4 text-xs text-coral underline" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViviBot; 