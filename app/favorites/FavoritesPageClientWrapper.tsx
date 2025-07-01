"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "@/app/components/content/Skeleton";

const FavoritesPageClient = dynamic(() => import("./FavoritesPageClient"), {
  ssr: false,
});

export default function FavoritesPageClientWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        <Skeleton />
      </div>
    );
  return <FavoritesPageClient />;
}
