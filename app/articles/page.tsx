import ArticlesCatalogClient from "./ArticlesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default function ArticlesCatalogPage() {
  return (
    <>
      {/* Hero-блок каталога статей */}
       <CatalogHero id="hero-articles" />
      <ArticlesCatalogClient />
    </>
  );
} 