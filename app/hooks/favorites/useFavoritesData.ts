import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useMemo } from "react";
import { Product, Article, Recipe } from "@/types";

export function useFavoritesData() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const favoriteIds = useMemo(() => favorites.map(f => f.id), [favorites]);

  return useQuery<{
    products: Product[];
    articles: Article[];
    recipes: Recipe[];
  }>({
    queryKey: ["favorites-data", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds.length) return { products: [], articles: [], recipes: [] };
      const params = favoriteIds.map(id => `id=${encodeURIComponent(id)}`).join("&");
      const res = await fetch(`/api/favorites?${params}`);
      return res.json();
    },
    enabled: !!favoriteIds.length,
  });
} 