import ArticlesCatalogClient from "./ArticlesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";
import { Suspense } from "react";

export default async function ArticlesCatalogPage() {
  return (
    <>
      {/* Hero-блок каталога статей */}
      <CatalogHero id="hero-articles" />
      <Suspense fallback={null}>
        <ArticlesCatalogClient />
      </Suspense>
    </>
  );
}

export const dynamic = "force-dynamic"; 