import CardsSection from "../content/CardsSection";
import { getProducts } from "@/lib/sanityApi";
import { Product } from "@/types";

export default async function ProductsSection() {
  try {
    const products = await getProducts(3);
    
    return (
      <CardsSection
        title="Featured Products"
        items={products.map((p: Product) => ({ ...p, type: "product" as const }))}
        showMoreHref="/products"
        showMoreText="See Full Catalog"
      />
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="min-h-[300px] flex items-center justify-center text-red-500">
        Error loading products: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
} 