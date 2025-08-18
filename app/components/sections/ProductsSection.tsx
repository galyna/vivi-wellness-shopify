import CardsSection from "./CardsSection";
import { getProductsByHandles } from "@/lib/shopify-graphql";
import { Product } from "@/types";

export default async function ProductsSection() {
  // Укажите handle'ы конкретных продуктов, которые хотите показать на главной
  const specificProductHandles = [
    "yoga-wheel", // Замените на реальные handle'ы ваших продуктов
    "eco-yoga-mat"
  ];
  
  const products = await getProductsByHandles(specificProductHandles);
  const items = products as Array<Product & { type: "product" }>;
  
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
