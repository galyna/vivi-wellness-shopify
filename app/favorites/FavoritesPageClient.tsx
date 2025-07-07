"use client";

import { useFavoritesStore } from "@/app/store/favoritesStore";
import UniversalCard from "@/app/components/content/UniversalCard";
import { useMemo, useState } from "react";
import { Article, Product, Recipe } from "@/types";
import { useFavoritesData } from "@/a../hooks/favorites/useFavoritesData";
import { Skeleton } from "@/app/components/sections/Skeleton";

const filters = [
  { key: "all", label: "All" },
  { key: "article", label: "Articles" },
  { key: "recipe", label: "Recipes" },
  { key: "product", label: "Products" },
];

export default function FavoritesPageClient() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const [filter, setFilter] = useState<
    "all" | "article" | "recipe" | "product"
  >("all");

  const { data, isLoading: loading, error } = useFavoritesData();

  const { articles, products, recipes } = useMemo(
    () => ({
      articles: data?.articles ?? [],
      products: data?.products ?? [],
      recipes: data?.recipes ?? [],
    }),
    [data]
  );

  type ItemType = {
    type: "article" | "product" | "recipe";
    data: Article | Product | Recipe;
  };
  const items: ItemType[] = useMemo(() => {
    if (!favorites.length) return [];
    return favorites
      .filter((f) => filter === "all" || f.type === filter)
      .map((f) => {
        if (f.type === "article") {
          const data = articles.find((a) => a._id === f.id);
          return data ? { type: "article" as const, data } : null;
        }
        if (f.type === "product") {
          const data = products.find((p) => p._id === f.id);
          return data ? { type: "product" as const, data } : null;
        }
        if (f.type === "recipe") {
          const data = recipes.find((r) => r._id === f.id);
          return data ? { type: "recipe" as const, data } : null;
        }
        return null;
      })
      .filter(Boolean) as ItemType[];
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
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-1 rounded-full font-semibold ${
              filter === f.key
                ? "bg-coral text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="ml-auto px-4 py-1 rounded-full bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300"
          >
            Clear all
          </button>
        )}
      </div>
      {loading ? (
       <Skeleton />
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          Your favorites list is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.data._id} className="relative group">
              <UniversalCard
                type={item.type}
                data={item.data}
                key={item.data._id}
                hideFavoriteButton
              />
              <button
                className="absolute top-3 right-3 z-20 bg-white/80 rounded-full p-1 shadow hover:bg-coral hover:text-white transition"
                onClick={() => removeFavorite(item.data._id, item.type)}
                aria-label="Remove from favorites"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

