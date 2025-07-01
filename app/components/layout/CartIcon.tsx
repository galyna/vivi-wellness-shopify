"use client";
import { useCartStore } from "@/app/store/cartStore";
import { useCartSidebarStore } from "@/app/store/cartSidebarStore";

export default function CartIcon() {
  const items = useCartStore((state) => state.items);
  const { openSidebar } = useCartSidebarStore();
  return (
    <button
      type="button"
      className="relative"
      onClick={openSidebar}
      aria-label="Open cart"
    >
      {/* Классическая SVG иконка корзины */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-xl"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
      {items.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-1">
          {items.length}
        </span>
      )}
    </button>
  );
} 