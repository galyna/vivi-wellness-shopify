import Image from "next/image";
import { getCatalogHeroData } from "@/lib/sanityApi";

interface CatalogHeroProps {
  id: string;
}

// Асинхронный компонент для SSR/SSG
const CatalogHero = async ({ id }: CatalogHeroProps) => {
  // Получаем данные из Sanity
  const data = await getCatalogHeroData(id);
  if (!data) return null;
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] text-white">
      {/* Фоновое изображение */}
      {data.image && (
        <Image
          src={data.image}
          alt={data.title || "Catalog Hero"}
          fill
          className="object-cover object-center"
          priority
        />
      )}
      {/* Тёмный градиент как в Hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {/* Контент снизу слева */}
      <div className="relative z-10 h-full flex flex-col justify-end items-start p-8 md:p-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            {data.subtitle}
          </p>
        )}
        {data.ctaText && data.ctaUrl && (
          <a
            href={data.ctaUrl}
            className="px-8 py-3 rounded-full bg-charcoal text-white font-bold hover:bg-gray-800 transition-colors"
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

export default CatalogHero; 