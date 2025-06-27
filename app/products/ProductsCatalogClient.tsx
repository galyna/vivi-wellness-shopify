"use client";
import { useRouter } from "next/navigation";
import ProductCard from "../components/content/ProductCard";
import { Product } from "@/types";

interface Props {
  products: Product[];
  categories: string[];
  selectedCategory: string;
}

export default function ProductsCatalogClient({ products, categories, selectedCategory }: Props) {
  const router = useRouter();
  const filtered = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products;
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-charcoal text-center">Products Catalog</h1>
      <div className="mb-6 flex gap-2 items-center flex-wrap justify-center">
        <button
          type="button"
          className={`px-4 py-2 rounded-full font-bold border transition-colors ${!selectedCategory ? 'bg-charcoal text-white' : 'bg-white text-charcoal border-charcoal hover:bg-charcoal/10'}`}
          onClick={() => router.push(window.location.pathname)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2 rounded-full font-bold border transition-colors ${selectedCategory === cat ? 'bg-charcoal text-white' : 'bg-white text-charcoal border-charcoal hover:bg-charcoal/10'}`}
            onClick={() => router.push(`?category=${cat}`)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            slug={product.slug}
            title={product.title}
            description={product.description}
            price={product.price}
            category={product.category}
            image={product.mainImage?.asset?.url || "/placeholder.jpg"}
          />
        ))}
      </div>
    </main>
  );
} 