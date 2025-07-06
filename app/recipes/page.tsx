import RecipesCatalogClient from "./RecipesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default function RecipesCatalogPage() {
  return (
    <>
      {/* Hero-блок каталога рецептов */}
      <CatalogHero id="hero-recipes" />
      <RecipesCatalogClient />
    </>
  );
}
