"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIcon from "./CartIcon";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/articles", label: "Articles" },
];

const Header = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      setShow(current < 40 || current < lastScroll.current);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
        ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
        backdrop-blur-md bg-mint
        ${
          scrolled
            ? "border-b border-gray-200 shadow-md"
            : "border-none shadow-none"
        }
      `}
      style={{
        transitionProperty: "opacity, background, box-shadow, color, border",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide transition-colors duration-300 text-gray-900"
        >
          Vivi
        </Link>
        {/* Center nav */}
        <nav className="hidden md:flex gap-8 text-lg font-medium">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors duration-300 hover:underline underline-offset-4 text-gray-900 ${
                pathname === href ? "font-bold underline" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/favorites" className="relative" aria-label="Избранное">
            {/* fallback SVG heart icon */}
            <svg
              className="text-xl"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </Link>
          <CartIcon />
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 bg-gray-900 text-white"
            aria-label="Menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
