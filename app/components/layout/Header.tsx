"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/articles", label: "Articles" },
];

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="w-full py-4 px-8 bg-mint border-b border-gray-200 text-black flex items-center justify-between">
      <div className="text-xl font-bold">Vivi Wellness</div>
      <nav>
        <ul className="flex gap-6 text-md">
          {nav.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`hover:underline ${pathname === href ? "font-bold text-green-900 underline" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header; 