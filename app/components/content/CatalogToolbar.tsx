"use client";
import { useState } from "react";

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

  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-white sticky top-0 z-10">
      {/* Sort */}
      <button
        className="px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1"
        onClick={() => onSort(sortValue === "asc" ? "desc" : "asc")}
        aria-label={sortValue === "asc" ? "Sort descending" : "Sort ascending"}
      >
        <span>Sort</span>
        {sortValue === "asc" ? (
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>
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
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
