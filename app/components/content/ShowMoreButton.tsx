"use client";
import { ReactNode } from "react";

interface ShowMoreButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  showArrow?: boolean;
}

export default function ShowMoreButton({
  onClick,
  href,
  className = "",
  children,
  disabled = false,
  type = "button",
  showArrow = true,
}: ShowMoreButtonProps) {
  const baseClasses = "px-6 py-3 rounded-full bg-charcoal text-white font-bold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  const combinedClasses = `${baseClasses} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && (
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
} 