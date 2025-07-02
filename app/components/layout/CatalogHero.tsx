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
    <section className="w-full  flex flex-col md:flex-row items-center justify-between bg-[#222] rounded-3xl p-6 md:p-12 mb-12 shadow-lg">
      {/* Text block */}
      <div className="flex-1 flex flex-col justify-center items-start text-white mb-6 md:mb-0 md:mr-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.title}</h1>
        {data.subtitle && <p className="text-lg mb-6">{data.subtitle}</p>}
        {data.ctaText && data.ctaUrl && (
          <a
            href={data.ctaUrl}
            className="inline-flex items-center px-8 py-3 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-[#222] transition"
          >
            {data.ctaText}
            <span className="ml-2 text-xl">→</span>
          </a>
        )}
      </div>
      {/* Image block */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden">
          {data.image && (
            <Image
              src={data.image}
              alt={data.title || "Catalog Hero"}
              width={600}
              height={450}
              className="object-cover w-full h-full"
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CatalogHero; 