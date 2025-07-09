import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteType = "article" | "recipe" | "product";
export interface FavoriteItem {
  id: string;
  type: FavoriteType;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string, type: FavoriteType) => void;
  isFavorite: (id: string, type: FavoriteType) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item: FavoriteItem) =>
        set((state) =>
          state.favorites.some((f) => f.id === item.id && f.type === item.type)
            ? state
            : { favorites: [...state.favorites, item] }
        ),
      removeFavorite: (id: string, type: FavoriteType) =>
        set((state) => ({ favorites: state.favorites.filter((f) => !(f.id === id && f.type === type)) })),
      isFavorite: (id: string, type: FavoriteType) =>
        get().favorites.some((f) => f.id === id && f.type === type),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "vivi-favorites-zustand"
    }
  )
); 