import CardsSection from "../content/CardsSection";
import { getProducts } from "@/lib/sanityApi";
import { Product } from "@/types";


export default async function ProductsSection() {
  const products = await getProducts(2);
  const items = products.map((p: Product) => ({ ...p, type: "product" as const }));
  return (
    <CardsSection
      title="Products"
      items={items}
      showMoreHref="/products"
      showMoreText="Show all products"
    />
  );
} 