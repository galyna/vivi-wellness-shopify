import CardsSection from "./CardsSection";
import { getRecipes } from "@/lib/sanityApi";
import { Recipe } from "@/types";

export default async function RecipesSection() {
  const recipes = await getRecipes(2);
  return (
    <section className="mb-4 max-w-7xl mx-auto relative">
      <div className="px-8 lg:px-16 py-12 lg:py-16">
        <CardsSection
          title="Featured Recipes"
          items={recipes.map((r: Recipe) => ({
            ...r,
            type: "recipe" as const,
          }))}
          showMoreHref="/recipes"
          showMoreText="Explore Recipes"
        />
      </div>
    </section>
  );
}
