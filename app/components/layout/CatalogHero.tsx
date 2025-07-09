import Image from "next/image";
import { getCatalogHeroData } from "@/lib/sanityApi";
import AskViviButton from "../content/AskViviButton";

interface CatalogHeroProps {
  id: string;
}

// Асинхронный компонент для SSR/SSG
const CatalogHero = async ({ id }: CatalogHeroProps) => {
  // Получаем данные из Sanity
  const data = await getCatalogHeroData(id);
  if (!data) return null;
  return (
    <div className="max-w-7xl mx-auto  px-8 pt-14 pb-12 lg:px-16">
      
      <section className="w-full flex flex-col md:flex-row items-stretch justify-between  rounded-3xl  shadow-lg overflow-hidden">
        {/* Image block — сверху на мобиле, справа на десктопе */}
        <div className="w-full md:w-1/2 h-48 md:h-auto aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0 relative">
          {data.image && (
            <Image
              src={data.image}
              alt={data.title || "Catalog Hero"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover w-full h-full"
              priority
            />
          )}
        </div>
        {/* Text block */}
        <div className="flex-1 flex bg-[#222] flex-col justify-center items-start text-white p-6 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.title}</h1>
          {data.subtitle && <p className="text-lg mb-6">{data.subtitle}</p>}
          {data.ctaText && data.ctaUrl && (
            <AskViviButton />
          )}
        </div>
      </section>
    </div>
  );
};

export default CatalogHero;
