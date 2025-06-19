import React from "react";

const Hero = () => (
  <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-mint rounded-3xl shadow-md mb-8">
    <div className="text-3xl md:text-5xl font-bold text-charcoal mb-2 font-sans">Vivi — your wellness & lifestyle AI companion</div>
    <div className="text-lg md:text-2xl text-charcoal/80 mb-6 font-accent">Find balance, joy, and healthy habits every day — with a little help from Vivi.</div>
    <div className="w-40 h-40 bg-lemon rounded-full flex items-center justify-center shadow-lg mb-4">
      {/* Иллюстрация-заглушка */}
      <span className="text-6xl">🌱</span>
    </div>
    <button className="mt-2 px-6 py-3 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition">Ask Vivi</button>
  </section>
);

export default Hero; 