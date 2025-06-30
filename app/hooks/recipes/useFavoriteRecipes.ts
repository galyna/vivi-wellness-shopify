import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useMemo } from "react";
import { Recipe } from "@/types";
import client from "@/lib/sanity";

export function useFavoriteRecipes() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const favoriteIds = useMemo(
    () => favorites.filter((f) => f.type === "recipe").map((f) => f.id),
    [favorites]
  );

  return useQuery<Recipe[]>({
    queryKey: ["favorite-recipes", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds.length) return [];
      const query = `*[_type == \"recipe\" && _id in ${JSON.stringify(favoriteIds)}]{_id, title, description, ingredients, steps, category}`;
      const result = await client.fetch<Recipe[]>(query);
      return favoriteIds
        .map((id) => result.find((r: Recipe) => r._id === id))
        .filter(Boolean) as Recipe[];
    },
    enabled: !!favoriteIds.length,
  });
} 