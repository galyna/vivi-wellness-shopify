"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useCartStore } from "@/app/store/cartStore";
import { useCartSidebarStore } from "@/app/store/cartSidebarStore";

interface ProductData {
  _id: string;
  title: string;
  mainImage?: { asset?: { url?: string } };
  galleryImages?: { asset?: { url?: string } }[];
  category?: string;
  price: number;
  description?: string;
  color?: string;
  size?: string;
  material?: string;
}

export default function ProductPageClient({ product, gallery }: { product: ProductData; gallery: string[] }) {
  const [mainImg, setMainImg] = useState(gallery[0]);

  // Favorites logic
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { addToCart } = useCartStore();
  const { openSidebar } = useCartSidebarStore();
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toastText = "Added to favorites!";
  useEffect(() => setMounted(true), []);

  const favorite = isFavorite(product._id, "product");

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(product._id, "product");
    } else {
      addFavorite({ id: product._id, type: "product" });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1200);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-14 md:pt-16 flex flex-col md:flex-row gap-12">
      {/* Gallery */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-full aspect-[4/3] bg-gray-100  overflow-hidden shadow-lg rounded-3xl  flex items-center justify-center mb-4">
          <Image src={mainImg} alt={product.title} width={600} height={450} 
          sizes="(max-width: 768px) 100vw, 50vw" className="object-cover w-full h-full" />
          {mounted && (
            <button
              className={`absolute top-3 right-3 rounded-full p-2 shadow transition ${favorite ? "bg-coral/90" : "bg-white/80"}`}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              onClick={handleFavorite}
            >
              <svg
                width="24"
                height="24"
                fill={favorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={favorite ? "text-white" : "text-gray-400 hover:text-coral transition"}
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
              {toastText}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {gallery.map((img: string) => (
            <button key={img} onClick={() => setMainImg(img)} className={`w-20 h-16 rounded-xl overflow-hidden border ${mainImg === img ? "border-coral" : "border-gray-200"}`}>
              <Image src={img} alt="thumb" width={80} height={64} sizes="80px" className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      </div>
      {/* Info */}
      <div className="flex-1 max-w-lg mx-auto flex flex-col">
        <div className="mb-2 text-sm text-gray-500">{product.category}</div>
        <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold">${product.price}</span>
          {/* Rating and stars */}
          <span className="ml-4 text-yellow-500 font-bold">★ 4.6/5</span>
        </div>
        <div className="mb-4 text-gray-700">{product.description}</div>
        
        {/* Product details */}
        <div className="mb-6 space-y-3">
          {product.color && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Color:</span>
              <span className="text-sm">{product.color}</span>
            </div>
          )}
          {product.size && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Size:</span>
              <span className="text-sm">{product.size}</span>
            </div>
          )}
          {product.material && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Material:</span>
              <span className="text-sm">{product.material}</span>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <button
            className="w-full md:max-w-xs py-3 rounded-full bg-black text-white font-bold text-lg mt-4 hover:bg-coral transition"
            onClick={() => {
              addToCart(product._id, 1);
              openSidebar();
            }}
          >
            Add to basket
          </button>
        </div>
        
      </div>
    </main>
  );
} 