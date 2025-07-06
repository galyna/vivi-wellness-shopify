import ProductsCatalogClient from "./ProductsCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default function ProductsCatalogPage() {
  return (
    <>
      {/* Hero-блок каталога продуктов */}
      <CatalogHero id="hero-products" />
      <ProductsCatalogClient />
    </>
  );
}
