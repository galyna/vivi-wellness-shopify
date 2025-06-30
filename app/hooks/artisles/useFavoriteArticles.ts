import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useMemo } from "react";
import { Article } from "@/types";
import client from "@/lib/sanity";

export function useFavoriteArticles() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const favoriteIds = useMemo(
    () => favorites.filter((f) => f.type === "article").map((f) => f.id),
    [favorites]
  );

  return useQuery<Article[]>({
    queryKey: ["favorite-articles", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds.length) return [];
      const query = `*[_type == \"article\" && _id in ${JSON.stringify(favoriteIds)}]{_id, title, description, body, category}`;
      const result = await client.fetch<Article[]>(query);
      return favoriteIds
        .map((id) => result.find((a: Article) => a._id === id))
        .filter(Boolean) as Article[];
    },
    enabled: !!favoriteIds.length,
  });
} 