"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/recipes", label: "Recipes" },
  { href: "/articles", label: "Articles" },
];

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: MenuProps) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const prevPath = useRef(pathname);

  // Close menu automatically once the route has actually changed
  useEffect(() => {
    if (prevPath.current !== pathname) {
      onClose();
      prevPath.current = pathname;
    }
  }, [pathname, onClose]);

  const handleLinkClick = (href: string) => {
    if (href === pathname) {
      // Same route – just close instantly
      onClose();
    } else {
      router.push(href);
      // do NOT close yet – wait for pathname change to close overlay
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white transition-colors duration-300 hover:bg-gray-700"
        aria-label="Close menu"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Menu content */}
      <div className="flex flex-col items-center justify-center h-[100vh] bg-mint w-full">
        <nav className="flex flex-col items-center gap-8 text-2xl font-medium">
          {nav.map(({ href, label }) => (
            <button
              key={href}
              onClick={() => handleLinkClick(href)}
              className={`transition-colors duration-300 hover:underline underline-offset-4 text-gray-900 ${
                pathname === href ? "font-bold underline" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Additional mobile menu items */}
        <div className="flex items-center gap-6 mt-12">
          <button 
            onClick={() => handleLinkClick('/favorites')}
            className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:underline underline-offset-4"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            Favorites
          </button>
         <button
           onClick={() => handleLinkClick('/cart')}
           className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:underline underline-offset-4"
         >
           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
             <circle cx="9" cy="21" r="1" />
             <circle cx="20" cy="21" r="1" />
             <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
           Cart
         </button>
        </div>
      </div>
    </div>
  );
};

export default Menu; 