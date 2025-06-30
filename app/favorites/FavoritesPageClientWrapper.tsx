"use client";
import dynamic from "next/dynamic";
const FavoritesPageClient = dynamic(() => import("./FavoritesPageClient"), { ssr: false });

export default function FavoritesPageClientWrapper() {
  return <FavoritesPageClient />;
} 