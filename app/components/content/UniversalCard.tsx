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
  showTypeMarker?: boolean;
  priority?: boolean;
}

const UniversalCard: FC<UniversalCardProps<Product | Article | Recipe>> = ({
  type,
  data,
  hideFavoriteButton,
  showTypeMarker = false,
  priority = false,
}) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCartStore();
  const { openSidebar } = useCartSidebarStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!data) return null;
  // Универсальные поля
  let slug = "";
  if (typeof data.slug === "string") {
    slug = data.slug;
  } else if (
    data.slug &&
    typeof data.slug === "object" &&
    "current" in data.slug &&
    typeof (data.slug as { current: string }).current === "string"
  ) {
    slug = (data.slug as { current: string }).current;
  }
  const title = data.title;
  let image = "/placeholder.jpg";
  if ("image" in data && typeof data.image === "string") image = data.image;
  else if ("mainImage" in data && data.mainImage?.asset?.url)
    image = data.mainImage.asset.url;
  else if ("images" in data && Array.isArray(data.images) && data.images.length > 0) {
    // Безопасно получаем первое изображение
    const firstImage = data.images.find((img: unknown) => img && typeof img === 'string' && img.trim() !== '');
    if (firstImage) {
      image = firstImage;
    }
  }
  const category = data.category || "Uncategorized";
  const price = type === "product" ? (data as Product).price : undefined;

  // Ссылки
  let href = "#";
  if (type === "article") href = `/articles/${slug}`;
  else if (type === "product") href = `/products/${slug}`;
  else if (type === "recipe") href = `/recipes/${slug}`;

  const favType = type as FavoriteType;
  const favId = slug; // Используем slug для всех типов
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
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center rounded-3xl"
            priority={priority}
          />
          {/* Категория */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-1 rounded-full shadow-sm">
            {category}
          </div>
          {/* Тип маркер */}
          {showTypeMarker && (
            <div className="absolute top-12 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-500 px-2 py-1 rounded-full shadow-sm capitalize">
              {type}
            </div>
          )}
        
          {/* Сердце */}
          {mounted && !hideFavoriteButton && (
            <button
              className={`absolute top-3 right-3 rounded-full p-2 shadow z-10 transition ${
                favorite ? "bg-coral/90" : "bg-white/80"
              }`}
              tabIndex={-1}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              onClick={handleFavorite}
            >
              <svg
                width="22"
                height="22"
                fill={favorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={
                  favorite
                    ? "text-white"
                    : "text-gray-400 group-hover:text-coral transition"
                }
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
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
        <div className="p-4 flex-1 flex flex-col justify-between w-full">
    
            {price && (
              <div className="text-base font-bold text-coral flex items-center justify-center ">
                ${price}
              </div>
            )}
         
            <div className="font-bold text-lg flex justify-center w-full text-charcoal mb-2 mt-2 line-clamp-2">
              {title}
            </div>
           
          
          <div className="flex justify-center w-full">
           {/* Add to cart button */}
          {type === "product" && (
            <button
              className="mt-3 w-full md:w-3/5 max-w-sm py-2 rounded-full border-2 border-coral text-coral font-bold hover:text-white hover:bg-coral/80 transition"
              onClick={(e) => {
                e.preventDefault();
                addToCart(data._id, 1);
                openSidebar();
              }}
            >
              Add to cart
            </button>
          )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UniversalCard;
