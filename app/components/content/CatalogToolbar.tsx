"use client";
import { useState, useEffect } from "react";

export default function CatalogToolbar({
  onSearch,
  onSort,
  onFilter,
  filterCount = 0,
  sortValue = "",
  searchValue = "",
  pageType = "products",
  searchPlaceholder = "Search products...",
}: {
  onSearch: (v: string) => void;
  onSort: (v: string) => void;
  onFilter: () => void;
  filterCount?: number;
  sortValue?: string;
  searchValue?: string;
  pageType?: "products" | "articles" | "recipes";
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = useState(searchValue);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Update local state when searchValue prop changes
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  const getSortOptions = () => {
    const baseOptions = [
      { value: "title_asc", label: "Name A-Z" },
      { value: "title_desc", label: "Name Z-A" },
    ];

    // Only add price and date options for products
    if (pageType === "products") {
      return [
        ...baseOptions, // Name options
        { value: "price_asc", label: "Price Low-High" },
        { value: "price_desc", label: "Price High-Low" },
        { value: "created_desc", label: "Newest First" },
        { value: "created_asc", label: "Oldest First" },
      ];
    }

    return baseOptions;
  };

  const sortOptions = getSortOptions();
  const currentSortLabel = sortOptions.find(option => option.value === sortValue)?.label || "Sort by";

  return (
    <div className="flex items-center gap-3 px-8 py-4 bg-white min-h-[64px] border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex-1 flex items-center gap-3">
        {/* Custom Sort Dropdown */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral hover:border-coral transition-colors flex items-center gap-2 min-w-[140px] justify-between"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <span>{currentSortLabel}</span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className={`transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {sortDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                    sortValue === option.value
                      ? "bg-coral text-white"
                      : "text-charcoal hover:bg-coral/10"
                  }`}
                  onClick={() => {
                    onSort(option.value);
                    setSortDropdownOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter */}
        <button
          className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium bg-white text-charcoal hover:border-coral hover:bg-coral/5 transition-all duration-200 flex items-center gap-2 group"
          onClick={onFilter}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-coral transition-colors">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
          </svg>
          <span>Filter</span>
          {filterCount > 0 && (
            <span className="bg-coral text-white rounded-full px-2 py-0.5 text-xs font-bold min-w-[18px] flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>

        {/* Search */}
        <div className="flex-1 relative">
          <input
            className="w-full px-4 py-2 rounded-full border border-gray-200 text-sm bg-white text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral transition-colors"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Search icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {sortDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setSortDropdownOpen(false)}
        />
      )}
    </div>
  );
}
