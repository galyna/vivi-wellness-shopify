"use client";
import Image from "next/image";
import Link from "next/link";
import { Article, Recipe, Product } from "@/types";
import { FC, useState, useEffect } from "react";
import { useFavoritesStore, FavoriteType } from "@/app/store/favoritesStore";
import { useCartStore } from "@/app/store/cartStore";
import { useCartSidebarStore } from "@/app/store/cartSidebarStore";

interface UniversalCardProps<T> {
  type: "product" | "article" | "recipe";
  data: T;
  hideFavoriteButton?: boolean;
}

const UniversalCard: FC<UniversalCardProps<Product | Article | Recipe>> = ({ type, data, hideFavoriteButton }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCartStore();
  const { openSidebar } = useCartSidebarStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!data) return null;
  // Универсальные поля
  let slug = '';
  if (typeof data.slug === 'string') {
    slug = data.slug;
  } else if (
    data.slug &&
    typeof data.slug === 'object' &&
    'current' in data.slug &&
    typeof (data.slug as { current: string }).current === 'string'
  ) {
    slug = (data.slug as { current: string }).current;
  }
  const title = data.title;
  let image = "/placeholder.jpg";
  if ("image" in data && typeof data.image === "string") image = data.image;
  else if ("cardImage" in data && data.cardImage?.asset?.url)
    image = data.cardImage.asset.url;
  else if ("mainImage" in data && data.mainImage?.asset?.url)
    image = data.mainImage.asset.url;
  const category = data.category || "Uncategorized";
  const price = type === "product" ? (data as Product).price : undefined;

  // Ссылки
  const href =
    type === "article"
      ? `/articles/${slug}`
      : type === "recipe"
      ? `/recipes/${slug}`
      : `/products/${slug}`;

  const favType = type as FavoriteType;
  const favId = data._id;
  const favorite = isFavorite(favId, favType);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(favId, favType);
    } else {
      addFavorite({ id: favId, type: favType });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1200);
    }
  };

  return (
    <Link href={href} className="block h-full group cursor-pointer">
      <div className="relative overflow-hidden flex flex-col h-full">
        {/* Фото + иконка лайка */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center rounded-3xl"
            priority={false}
          />
          {/* Сердце */}
          {mounted && !hideFavoriteButton && (
            <button
              className={`absolute top-3 right-3 rounded-full p-2 shadow z-10 transition ${favorite ? "bg-coral/90" : "bg-white/80"}`}
              tabIndex={-1}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              onClick={handleFavorite}
            >
              <svg width="22" height="22" fill={favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={favorite ? "text-white" : "text-gray-400 group-hover:text-coral transition"}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </button>
          )}
          {showToast && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-coral text-white text-xs px-3 py-1 rounded-full shadow animate-fade-in-out pointer-events-none z-20">
              Added to favorites!
            </div>
          )}
        </div>
        {/* Контент */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-1 font-medium">{category}</div>
            <div className="font-bold text-lg text-charcoal mb-1 line-clamp-2">{title}</div>
          </div>
          {price && (
            <div className="text-base font-bold text-coral mt-2">${price}</div>
          )}
          {/* Add to cart button */}
          {type === "product" && (
            <button
              className="mt-3 w-2/5 py-2 rounded-full border-2 border-coral text-coral font-bold hover:text-white hover:bg-coral/50 transition"
              onClick={e => {
                e.preventDefault();
                addToCart(favId, 1);
                openSidebar();
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UniversalCard;
