import Image from "next/image";
import { getCatalogHeroData } from "@/lib/sanityApi";

interface InspireHeroProps {
  id: string;
  reverse?: boolean;
}

const InspireHero = async ({ id, reverse = false }: InspireHeroProps) => {
  const data = await getCatalogHeroData(id);
  if (!data) return null;
  return (
    <section className="w-full  py-12 md:py-20">
      <div
        className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 px-4 md:px-8 ${reverse ? "md:flex-row-reverse" : ""}`}
      >
        {/* Картинка */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          {data.image && (
            <div className="relative aspect-[4/3] md:aspect-square w-full h-64 md:h-auto rounded-lg overflow-hidden">
              <Image
                src={data.image}
                alt={data.title || "Inspire Hero"}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          )}
        </div>
        {/* Текст */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
          {data.smallTitle && (
            <span className="text-sm text-gray-500 mb-2 font-medium tracking-wide uppercase">{data.smallTitle}</span>
          )}
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4 text-gray-900 leading-tight">{data.title}</h2>
          <div className="w-16 h-px bg-gray-300 mb-6" />
          {data.subtitle && (
            <p className="text-base md:text-lg text-gray-700 mb-2">{data.subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default InspireHero; 