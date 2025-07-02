import { getRecipes } from "@/lib/sanityApi";
import { Recipe } from "@/types";
import RecipesCatalogClient from "./RecipesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default async function RecipesCatalogPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const recipes: Recipe[] = await getRecipes();
  const categories: string[] = Array.from(new Set(recipes.map((r) => r.category).filter(Boolean))) as string[];
  const params = await searchParams;
  const selectedCategory = params?.category || '';
  return (
    <>
      {/* Hero-блок каталога рецептов */}
      <div className="max-w-7xl mx-auto  px-8 py-8 lg:px-16">  <CatalogHero id="hero-recipes" /></div>
      <RecipesCatalogClient recipes={recipes} categories={categories} selectedCategory={selectedCategory} />
    </>
  );
} 