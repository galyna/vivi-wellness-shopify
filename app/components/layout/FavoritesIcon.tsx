"use client";
import Link from "next/link";
import { useFavoritesStore } from "@/app/store/favoritesStore";

export default function FavoritesIcon() {
  const favorites = useFavoritesStore((state) => state.favorites);
  return (
    <Link href="/favorites" className="relative" aria-label="Избранное">
      {/* fallback SVG heart icon */}
      <svg className="text-xl" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
      {favorites.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-1">
          {favorites.length}
        </span>
      )}
    </Link>
  );
} 