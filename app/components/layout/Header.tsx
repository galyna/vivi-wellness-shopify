"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/articles", label: "Articles" },
];

const Header = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  // Show header only when scrolling up
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
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-500 
        ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        backdrop-blur-md bg-mint/60
        ${scrolled ? "border-b border-gray-200 shadow-md" : "border-none shadow-none"}
      `}
      style={{
        // smooth fade in/out
        transitionProperty: "opacity, background, box-shadow, color, border",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide transition-colors duration-300 text-gray-900">Vivi</Link>
        {/* Center nav */}
        <nav className="hidden md:flex gap-8 text-lg font-medium">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors duration-300 hover:underline underline-offset-4 text-gray-900 ${pathname === href ? "font-bold underline" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Right: Shop button and menu */}
        <div className="flex items-center gap-4">
          <Link href="/products" className="hidden md:inline-block px-5 py-2 rounded-full font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-gray-700">Shop</Link>
          {/* Hamburger for mobile */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 bg-gray-900 text-white" aria-label="Menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 