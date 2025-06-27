import React from "react";
import Image from "next/image";
import { getCatalogHeroData } from "@/lib/sanityApi";

// Пример: Hero получает id через пропсы или хардкод
const HERO_ID = "hero-1"; // или другой id из Sanity

const Hero = async () => {
  const hero = await getCatalogHeroData(HERO_ID);
  return (
    <section className="relative w-full h-min-[500px] h-[90vh] lg:h-[70vh] text-white pt-20">
      {hero?.image && (
        <Image
          src={hero.image}
          alt={hero.title || "Hero"}
          fill
          className="object-cover object-center"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end items-start p-8 md:p-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {hero?.title || "Wellness Speaker + Movement Facilitator"}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          {hero?.subtitle || "Break through barriers and unlock a transformative experience of radical healing and unstoppable joy."}
        </p>
        <a
          href={hero?.ctaUrl || "#"}
          className="px-8 py-3 rounded-full bg-charcoal text-white font-bold hover:bg-gray-800 transition-colors"
        >
          {hero?.ctaText || "Get a quote"}
        </a>
      </div>
    </section>
  );
};

export default Hero; 