import CardsSection from "./CardsSection";
import { getProducts } from "@/lib/sanityApi";
import { Product } from "@/types";

export default async function ProductsSection() {
  const products = await getProducts(2);
  const items = products.map((p: Product) => ({
    ...p,
    type: "product" as const,
  }));
  return (
    <section className="mb-4 max-w-7xl mx-auto relative">
      <div className="px-8 lg:px-16 py-12 lg:py-16">
        <CardsSection
          title="Products"
          items={items}
          showMoreHref="/products"
          showMoreText="Show all products"
        />
      </div>
    </section>
  );
}
