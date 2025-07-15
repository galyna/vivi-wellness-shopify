"use client";
import { useState, useEffect } from "react";

export default function CatalogToolbar({
  onSearch,
  onSort,
  onFilter,
  filterCount = 0,
  sortValue = "",
  searchValue = "",
}: {
  onSearch: (v: string) => void;
  onSort: (v: string) => void;
  onFilter: () => void;
  filterCount?: number;
  sortValue?: string;
  searchValue?: string;
}) {
  const [search, setSearch] = useState(searchValue);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms delay

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

  return (
    <div className="flex items-center gap-2 px-8 py-2 bg-white min-h-[64px]">
      <div className="max-w-6xl mx-auto flex-1 flex items-center gap-2">
      {/* Sort */}
      <select
        className="px-3 py-1 rounded-full border text-sm font-medium"
        value={sortValue}
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="title_asc">Name A-Z</option>
        <option value="title_desc">Name Z-A</option>
        <option value="price_asc">Price Low-High</option>
        <option value="price_desc">Price High-Low</option>
        <option value="created_desc">Newest First</option>
        <option value="created_asc">Oldest First</option>
      </select>
      {/* Filter */}
      <button
        className="px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1"
        onClick={onFilter}
      >
        <span>Filter</span>
        {filterCount > 0 && (
          <span className="bg-coral text-white rounded-full px-2 py-0.5 text-xs">
            {filterCount}
          </span>
        )}
      </button>
      {/* Search */}
      <div className="flex-1">
        <input
          className="w-full px-3 py-1 rounded-full border text-sm"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      </div>
    </div>
  );
}
