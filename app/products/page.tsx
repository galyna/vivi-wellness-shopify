import { getProducts } from "@/lib/sanityApi";
import { Product } from "@/types";
import ProductsCatalogClient from "./ProductsCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default async function ProductsCatalogPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const products: Product[] = await getProducts();
  const categories: string[] = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];
  const params = await searchParams;
  const selectedCategory = params?.category || '';
  return (
    <>
      {/* Hero-блок каталога продуктов */}
     <div className="max-w-7xl mx-auto  px-8 pt-12 pb-10 lg:px-16"> <CatalogHero id="hero-products" /></div>
      <ProductsCatalogClient products={products} categories={categories} selectedCategory={selectedCategory} />
    </>
  );
} 