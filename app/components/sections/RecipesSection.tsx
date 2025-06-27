import CardsSection from "../content/CardsSection";
import { getRecipes } from "@/lib/sanityApi";
import { Recipe } from "@/types";

export default async function RecipesSection() {
  const recipes = await getRecipes(3);
  return (
    <CardsSection
      title="Featured Recipes"
      items={recipes.map((r: Recipe) => ({ ...r, type: "recipe" as const }))}
      showMoreHref="/recipes"
      showMoreText="Explore Recipes"
    />
  );
} 