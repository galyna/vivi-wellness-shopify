"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";

import InfiniteScroll from "../components/content/InfiniteScroll";
import { useInfiniteProducts } from "../hooks/product/useInfiniteProducts";
import { Skeleton } from "../components/sections/Skeleton";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

type ProductFilterSettings = {
  category?: string;
};


export default function ProductsCatalogClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("title_asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settings, setSettings] = useState<ProductFilterSettings>({
    category: selectedCategory || "",
  });

  // Use infinite query for products
  const queryParams = useMemo(() => ({
    search,
    category: settings.category || "",
    sort,
  }), [search, settings, sort]);

  const {
    data: infiniteData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts(queryParams);

  // Используем данные из React Query
  const displayProducts = infiniteData?.pages.flatMap(page => page.products) || [];

  // Fetch categories from Shopify
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData?.categories || [];



  if (isLoading) {
    return (
      <div>
        <div className="bg-white">
                  <CatalogToolbar
          onSearch={setSearch}
          onSort={(v) => setSort(v)}
          onFilter={() => setFilterOpen(true)}
          filterCount={settings.category ? 1 : 0}
          sortValue={sort}
          searchValue={search}
        />
        </div>
        <main>
          <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16 relative space-y-10 lg:space-y-12">
            <Skeleton />
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">Error loading products</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white">
        <CatalogToolbar
          onSearch={setSearch}
          onSort={(v) => setSort(v)}
          onFilter={() => setFilterOpen(true)}
          filterCount={settings.category ? 1 : 0}
          sortValue={sort}
          searchValue={search}
        />
      </div>
      <main className="relative">
        <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16 relative space-y-10 lg:space-y-12">
          <InfiniteScroll
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage ?? false}
            isLoading={isFetchingNextPage}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayProducts.map((product: Product) => (
                <div key={product._id} className="w-full max-w-sm mx-auto sm:max-w-full">
                  <UniversalCard type="product" data={product} />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </section>
      </main>
      {/* Simple category filter for now */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9999] flex items-end"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="bg-white md:rounded-t-3xl z-[9999] p-0 md:pt-5 relative w-full h-full md:h-auto md:max-w-6xl md:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-2xl text-coral z-10"
              onClick={() => setFilterOpen(false)}
              aria-label="Close filter"
              type="button"
            >
              ×
            </button>
            <div className="p-8">
              <div className="font-bold mb-4">Category</div>
              <div className="space-y-2">
                {categories.map((cat: string) => (
                  <button
                    key={cat}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      settings.category === cat 
                        ? "bg-coral text-white" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSettings({ category: settings.category === cat ? "" : cat });
                      setFilterOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setSettings({ category: "" });
                  setFilterOpen(false);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
      {displayProducts.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          No products found.
        </div>
      )}
    </div>
  );
}
