import { useQuery } from "@tanstack/react-query";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useMemo } from "react";
import { Product } from "@/types";
import client from "@/lib/sanity";

export function useFavoriteProducts() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const favoriteIds = useMemo(
    () => favorites.filter((f) => f.type === "product").map((f) => f.id),
    [favorites]
  );

  return useQuery<Product[]>({
    queryKey: ["favorite-products", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds.length) return [];
      const query = `*[_type == \"product\" && _id in ${JSON.stringify(favoriteIds)}]{_id, title, description, price, category}`;
      const result = await client.fetch<Product[]>(query);
      return favoriteIds
        .map((id) => result.find((p: Product) => p._id === id))
        .filter(Boolean) as Product[];
    },
    enabled: !!favoriteIds.length, // Запрос только если есть избранное
  });
} 