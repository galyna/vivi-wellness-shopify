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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-charcoal">Products Catalog</h1>
      <form className="mb-6 flex gap-4 items-center">
        <label htmlFor="category" className="font-bold">Category:</label>
        <select
          id="category"
          name="category"
          className="border rounded px-3 py-2"
          value={selectedCategory}
          onChange={e => {
            router.push(e.target.value ? `?category=${e.target.value}` : "");
          }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </form>
      <div className="flex flex-wrap gap-6 justify-center">
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