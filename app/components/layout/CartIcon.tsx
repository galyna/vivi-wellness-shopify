"use client";
import { useCartStore } from "@/app/store/cartStore";

export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  return (
    <div className="relative">
      {/* fallback SVG cart icon */}
      <svg className="text-xl" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M16 11V7a4 4 0 10-8 0v4a4 4 0 108 0zM6 7a4 4 0 118 0v4a4 4 0 11-8 0V7z" /></svg>
      {items.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-1">
          {items.length}
        </span>
      )}
    </div>
  );
} 