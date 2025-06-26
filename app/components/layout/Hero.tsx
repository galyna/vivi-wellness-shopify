import React from "react";
import Image from "next/image";
import { client } from "@/lib/sanityApi";

// Грубо: получаем первый hero-документ (можно доработать под slug/id)
async function fetchHero() {
  const [hero] = await client.fetch(`*[_type == "hero"][0...1]{
    title,
    subtitle,
    ctaText,
    ctaUrl,
    mainImage { asset->{url}, alt },
   
  }`);
  return hero;
}

const Hero = async () => {
  const hero = await fetchHero();
  return (
    <section className="relative w-full mb-8 overflow-hidden h-full  min-h-[50vh] bg-lemon ">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch h-full min-h-[50vh]">
        {/* Картинка сверху на мобиле */}
        <div className="relative flex justify-center items-center h-[40vh] md:h-[50vh] flex-1 w-full order-1 md:order-2">
          {hero?.mainImage?.asset?.url && (
            <Image
              src={hero.mainImage.asset.url}
              alt={hero.mainImage.alt || "Hero"}
              fill
              className="object-cover object-center w-full h-[40vh] md:h-[50vh]  rounded-none"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
        {/* Контент снизу на мобиле */}
        <div className="flex flex-col items-start justify-center h-full flex-1 z-10 px-8 md:px-16 py-8 order-2 md:order-1">
          {/* Лейбл/иконка */}
          <div className="mb-4 text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Daily protection
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{hero?.title || "Vivi — your wellness & lifestyle AI companion"}</h1>
          <p className="text-base md:text-lg text-charcoal/80 mb-6">{hero?.subtitle || "Find balance, joy, and healthy habits every day — with a little help from Vivi."}</p>
          <a
            href={hero?.ctaUrl || "#"}
            className="px-6 py-3 rounded-full border border-green-700 text-green-700 font-bold bg-white hover:bg-green-50 transition"
          >
            {hero?.ctaText || "Join the ritual"}
          </a>
        </div>
      </div>
     
    </section>
  );
};

export default Hero; 