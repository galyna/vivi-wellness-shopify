"use client";

import { useFavoritesStore } from "@/app/store/favoritesStore";
import UniversalCard from "@/app/components/content/UniversalCard";
import { useMemo, useState } from "react";
import { Article, Product, Recipe } from "@/types";
import { useFavoriteProducts } from "@/app/hooks/products/useFavoriteProducts";
import { useFavoriteArticles } from "@/app/hooks/artisles/useFavoriteArticles";
import { useFavoriteRecipes } from "@/app/hooks/recipes/useFavoriteRecipes";

export default function FavoritesPageClient() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const { removeFavorite, clearFavorites } = useFavoritesStore();
  const [filter, setFilter] = useState<"all" | "article" | "recipe" | "product">("all");

  const { data: articles = [], isLoading: loadingArticles, error: errorArticles } = useFavoriteArticles();
  const { data: products = [], isLoading: loadingProducts, error: errorProducts } = useFavoriteProducts();
  const { data: recipes = [], isLoading: loadingRecipes, error: errorRecipes } = useFavoriteRecipes();

  const loading = loadingArticles || loadingProducts || loadingRecipes;
  const error = errorArticles || errorProducts || errorRecipes;

  type ItemType = { type: "article" | "product" | "recipe"; data: Article | Product | Recipe };
  const items: ItemType[] = useMemo(() => {
    if (!favorites.length) return [];
    let arr: ItemType[] = [];
    if (filter === "all" || filter === "article") {
      arr = arr.concat(
        favorites
          .filter(f => f.type === "article" || filter === "all")
          .map(f => ({ type: "article" as const, data: articles.find((a: Article) => a._id === f.id) as Article }))
          .filter(i => i.data)
      );
    }
    if (filter === "all" || filter === "product") {
      arr = arr.concat(
        favorites
          .filter(f => f.type === "product" || filter === "all")
          .map(f => ({ type: "product" as const, data: products.find((p: Product) => p._id === f.id) as Product }))
          .filter(i => i.data)
      );
    }
    if (filter === "all" || filter === "recipe") {
      arr = arr.concat(
        favorites
          .filter(f => f.type === "recipe" || filter === "all")
          .map(f => ({ type: "recipe" as const, data: recipes.find((r: Recipe) => r._id === f.id) as Recipe }))
          .filter(i => i.data)
      );
    }
    return arr;
  }, [favorites, articles, products, recipes, filter]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        <div className="text-center text-red-500 py-20">
          Error loading favorites: {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter("all")} className={`px-4 py-1 rounded-full font-semibold ${filter === "all" ? "bg-coral text-white" : "bg-gray-100 text-gray-700"}`}>All</button>
        <button onClick={() => setFilter("article")} className={`px-4 py-1 rounded-full font-semibold ${filter === "article" ? "bg-coral text-white" : "bg-gray-100 text-gray-700"}`}>Articles</button>
        <button onClick={() => setFilter("recipe")} className={`px-4 py-1 rounded-full font-semibold ${filter === "recipe" ? "bg-coral text-white" : "bg-gray-100 text-gray-700"}`}>Recipes</button>
        <button onClick={() => setFilter("product")} className={`px-4 py-1 rounded-full font-semibold ${filter === "product" ? "bg-coral text-white" : "bg-gray-100 text-gray-700"}`}>Products</button>
        {favorites.length > 0 && (
          <button onClick={clearFavorites} className="ml-auto px-4 py-1 rounded-full bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300">Clear all</button>
        )}
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-20">Your favorites list is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.data._id} className="relative group">
              <UniversalCard type={item.type} data={item.data} />
              <button
                className="absolute top-3 right-3 z-20 bg-white/80 rounded-full p-1 shadow hover:bg-coral hover:text-white transition"
                onClick={() => removeFavorite(item.data._id, item.type)}
                aria-label="Remove from favorites"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 