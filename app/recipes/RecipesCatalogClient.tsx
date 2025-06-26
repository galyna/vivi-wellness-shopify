"use client";
import { useRouter } from "next/navigation";
import RecipeCard from "../components/content/RecipeCard";
import { Recipe } from "@/types";

interface Props {
  recipes: Recipe[];
  categories: string[];
  selectedCategory: string;
}

export default function RecipesCatalogClient({ recipes, categories, selectedCategory }: Props) {
  const router = useRouter();
  const filtered = selectedCategory ? recipes.filter((r) => r.category === selectedCategory) : recipes;
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-charcoal">Recipes Catalog</h1>
      <form className="mb-6 flex gap-4 items-center">
        <label htmlFor="category" className="font-bold">Category:</label>
        <select
          id="category"
          name="category"
          className="border rounded px-3 py-2"
          value={selectedCategory}
          onChange={e => {
            router.push(e.target.value ? `?category=${e.target.value}` : "");
          }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </form>
      <div className="flex flex-wrap gap-6 justify-center">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            slug={recipe.slug}
            title={recipe.title}
            ingredients={recipe.ingredients}
            category={recipe.category || 'Uncategorized'}
          />
        ))}
      </div>
    </main>
  );
} 