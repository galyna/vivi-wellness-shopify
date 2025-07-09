"use client";

import React from "react";
import Link from "next/link";
import { useFavoritesStore } from "@/app/store/favoritesStore";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/articles", label: "Articles" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const favCount = useFavoritesStore((s) => s.favorites.length);

  return (
    <footer className="w-full bg-charcoal text-white pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link href="/" className="text-3xl font-bold tracking-wide">Vivi</Link>
          <p className="mt-4 text-sm text-white/80 max-w-xs">
            Elevate your body, embrace your glow.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm uppercase font-semibold mb-4 text-white/70">Menu</h4>
          <ul className="space-y-2">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:underline hover:text-coral transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick actions */}
        <div>
          <h4 className="text-sm uppercase font-semibold mb-4 text-white/70">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/favorites" className="flex items-center gap-2 hover:underline hover:text-coral transition-colors">
                {/* Heart icon */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-coral">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                Favorites {favCount > 0 && `(${favCount})`}
              </Link>
            </li>
            <li>
              <Link href="/cart" className="flex items-center gap-2 hover:underline hover:text-coral transition-colors">
                {/* Cart icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="text-sm uppercase font-semibold mb-4 text-white/70">Contact</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Email: <a href="mailto:info@viviwellness.com" className="hover:underline">info@viviwellness.com</a></li>
            <li>Phone: <a href="tel:+15551234567" className="hover:underline">+1 (555) 123-4567</a></li>
            <li>Address: 123 Wellness St, Kyiv, Ukraine</li>
            <li>Instagram: <a href="https://instagram.com/viviwellness" target="_blank" rel="noopener" className="hover:underline">@viviwellness</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-white/20 text-center text-xs py-6 text-white/60 px-6">
        © {year} Vivi Wellness. Made with care in Ukraine.
      </div>
    </footer>
  );
};

export default Footer; 