"use client";
import { useCartStore } from "@/app/store/cartStore";
import { useCartSidebarStore } from "@/app/store/cartSidebarStore";

export default function CartIcon() {
  const lines = useCartStore(state => state.lines);
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
      {lines.length > 0 && (
        <span className="absolute -top-1.5 -right-3 bg-coral border border-white text-white text-xs rounded-full px-1">
          {lines.length}
        </span>
      )}
    </button>
  );
} 