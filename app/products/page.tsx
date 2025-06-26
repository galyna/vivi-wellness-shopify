import { getProducts } from "@/lib/sanityApi";
import { Product } from "@/types";
import ProductsCatalogClient from "./ProductsCatalogClient";


export default async function ProductsCatalogPage({ searchParams }: { searchParams?: { category?: string } }) {
  const products: Product[] = await getProducts();
  const categories: string[] = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];
  const selectedCategory = searchParams?.category || '';
  return <ProductsCatalogClient products={products} categories={categories} selectedCategory={selectedCategory} />;
} 