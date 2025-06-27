import { getRecipes } from "@/lib/sanityApi";
import { Recipe } from "@/types";
import RecipesCatalogClient from "./RecipesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default async function RecipesCatalogPage({ searchParams }: { searchParams?: { category?: string } }) {
  const recipes: Recipe[] = await getRecipes();
  const categories: string[] = Array.from(new Set(recipes.map((r) => r.category).filter(Boolean))) as string[];
  const selectedCategory = searchParams?.category || '';
  return (
    <>
      {/* Hero-блок каталога рецептов */}
      <CatalogHero id="hero-recipes" />
      <RecipesCatalogClient recipes={recipes} categories={categories} selectedCategory={selectedCategory} />
    </>
  );
} 