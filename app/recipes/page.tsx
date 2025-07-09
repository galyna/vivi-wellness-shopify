import RecipesCatalogClient from "./RecipesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";
import { Suspense } from "react";

export default async function RecipesCatalogPage() {
  return (
    <>
      {/* Hero-блок каталога рецептов */}
      <CatalogHero id="hero-recipes" />
      <Suspense fallback={null}>
        <RecipesCatalogClient initialRecipes={[]} />
      </Suspense>
    </>
  );
}

export const dynamic = "force-dynamic";
