"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useFavoritesStore } from "@/app/store/favoritesStore";
import { useCartStore } from "@/app/store/cartStore";
import { useCartSidebarStore } from "@/app/store/cartSidebarStore";
import { Product, ShopifyVariant, ShopifyOption } from "@/types";

interface ProductPageClientProps {
  product: Product;
  gallery: string[];
}

export default function ProductPageClient({
  product,
  gallery,
}: ProductPageClientProps) {
  const [mainImg, setMainImg] = useState(gallery[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Favorites logic
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { addToCart, lines } = useCartStore();
  const { openSidebar } = useCartSidebarStore();
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toastText = "Added to favorites!";
  useEffect(() => setMounted(true), []);

  // Initialize selected options from first variant
  useEffect(() => {
    if (product.variants?.[0]) {
      const initialOptions: Record<string, string> = {};
      product.variants[0].selectedOptions?.forEach(
        (option: { name: string; value: string }) => {
          initialOptions[option.name] = option.value;
        }
      );
      setSelectedOptions(initialOptions);
      setSelectedVariant(product.variants[0]);
    }
  }, [product.variants]);

  const favorite = isFavorite(product.slug, "product");
  const isInCart = selectedVariant
    ? lines.some((line) => line.merchandiseId === selectedVariant.id)
    : false;

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(product.slug, "product");
    } else {
      addFavorite({ id: product.slug, type: "product" });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1200);
    }
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product.variants?.find((variant: ShopifyVariant) =>
      variant.selectedOptions?.every(
        (option: { name: string; value: string }) =>
          newOptions[option.name] === option.value
      )
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const currentPrice = selectedVariant?.price?.amount
    ? parseFloat(selectedVariant.price.amount)
    : product.price;

  const isAvailable = selectedVariant?.availableForSale !== false;

  return (
    <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12 lg:py-16 flex flex-col md:flex-row gap-12">
      {/* Gallery */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shadow-lg rounded-3xl flex items-center justify-center mb-4">
          <Image
            src={mainImg}
            alt={product.title}
            width={600}
            height={450}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full h-full"
          />
          {mounted && (
            <button
              className={`absolute top-3 right-3 rounded-full p-2 shadow transition ${
                favorite ? "bg-coral/90" : "bg-white/80"
              }`}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              onClick={handleFavorite}
            >
              <svg
                width="24"
                height="24"
                fill={favorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={
                  favorite
                    ? "text-white"
                    : "text-gray-400 hover:text-coral transition"
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
              {toastText}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          {gallery.map((img: string) => (
            <button
              key={img}
              onClick={() => setMainImg(img)}
              className={`w-20 h-16 rounded-xl overflow-hidden border ${
                mainImg === img ? "border-coral" : "border-gray-200"
              }`}
            >
              <Image
                src={img}
                alt="thumb"
                width={80}
                height={64}
                sizes="80px"
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Info */}
      <div className="flex-1 max-w-lg mx-auto flex flex-col">
        <div className="mb-2 text-sm text-gray-500">{product.category}</div>
        <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold">${currentPrice}</span>
          {selectedVariant?.compareAtPrice?.amount && (
            <span className="text-lg text-gray-500 line-through">
              ${parseFloat(selectedVariant.compareAtPrice.amount)}
            </span>
          )}
        </div>
        <div className="mb-4 text-gray-700">{product.description}</div>

        {/* Product options */}
        {product.options && product.options.length > 0 && (
          <div className="mb-6 space-y-4">
            {product.options.map((option: ShopifyOption) => (
              <div key={option.name} className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {option.name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value: string) => (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                        selectedOptions[option.name] === value
                          ? "border-coral bg-coral text-white"
                          : "border-gray-300 text-gray-700 hover:border-coral"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center md:justify-start">
          {isInCart ? (
            <button
              className="w-full md:max-w-xs py-3 rounded-full font-bold text-lg mt-4 bg-gray-300 text-gray-500 cursor-not-allowed"
              disabled
            >
              In cart
            </button>
          ) : (
            <button
              className={`w-full md:max-w-xs py-3 rounded-full font-bold text-lg mt-4 transition ${
                isAvailable
                  ? "bg-black text-white hover:bg-coral"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => {
                if (isAvailable && selectedVariant) {
                  addToCart(selectedVariant.id, 1);
                  openSidebar();
                }
              }}
              disabled={!isAvailable}
            >
              {isAvailable ? "Add to basket" : "Out of stock"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
