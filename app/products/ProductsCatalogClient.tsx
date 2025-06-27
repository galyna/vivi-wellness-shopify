"use client";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import Image from "next/image";
import UniversalCard from "../components/content/UniversalCard";

interface Props {
  products: Product[];
  categories: string[];
  selectedCategory: string;
}

export default function ProductsCatalogClient({
  products,
  categories,
  selectedCategory,
}: Props) {
  const router = useRouter();
  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;
  return (
    <main className=" relative">
      <Image
        src="/bg2.jpg"
        alt="Background"
        fill
        className="object-cover object-center opacity-15 blur-lg pointer-events-none select-none z-0"
        priority={false}
      />
      <section className="mx-auto px-8 py-8 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
        <h1 className="text-3xl font-bold mb-6 text-charcoal text-center">
          Products Catalog
        </h1>
        <div className="mb-6 flex gap-2 items-center flex-wrap justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-bold border transition-colors ${
              !selectedCategory
                ? "bg-charcoal text-white"
                : "bg-white text-charcoal border-charcoal hover:bg-charcoal/10"
            }`}
            onClick={() => router.push(window.location.pathname)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-full font-bold border transition-colors ${
                selectedCategory === cat
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal border-charcoal hover:bg-charcoal/10"
              }`}
              onClick={() => router.push(`?category=${cat}`)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
          {filtered.map((product) => (
            <UniversalCard
              key={product._id}
              type="product"
              data={product}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
