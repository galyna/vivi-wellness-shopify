import ProductsCatalogClient from "./ProductsCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";
import { Suspense } from "react";

export default async function ProductsCatalogPage() {
  return (
    <>
      {/* Hero-блок каталога продуктов */}
      <CatalogHero id="hero-products" />
      <Suspense fallback={null}>
        <ProductsCatalogClient initialProducts={[]} />
      </Suspense>
    </>
  );
}

export const dynamic = "force-dynamic";
