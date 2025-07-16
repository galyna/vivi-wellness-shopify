"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";
import FilterModal from "../components/content/FilterModal";
import InfiniteScroll from "../components/content/InfiniteScroll";
import { useInfiniteProducts } from "../hooks/product/useInfiniteProducts";
import { Skeleton } from "../components/sections/Skeleton";
import { Product } from "@/types";

type ProductFilterSettings = {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
};


export default function ProductsCatalogClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("title_asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settings, setSettings] = useState<ProductFilterSettings>({
    categories: selectedCategory ? [selectedCategory] : [],
    colors: [],
    sizes: [],
    materials: [],
  });

  // Use infinite query for products
  const queryParams = useMemo(() => ({
    search,
    category: settings.categories?.[0] || "",
    sort,
    colors: settings.colors || [],
    sizes: settings.sizes || [],
    materials: settings.materials || [],
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





  if (isLoading) {
    return (
      <div>
        <div className="bg-white">
                  <CatalogToolbar
          onSearch={setSearch}
          onSort={(v) => setSort(v)}
          onFilter={() => setFilterOpen(true)}
          filterCount={Object.values(settings).filter(v => Array.isArray(v) ? v.length > 0 : Boolean(v)).length}
          sortValue={sort}
          searchValue={search}
          pageType="products"
          searchPlaceholder="Search products..."
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
          filterCount={Object.values(settings).filter(v => Array.isArray(v) ? v.length > 0 : Boolean(v)).length}
          sortValue={sort}
          searchValue={search}
          pageType="products"
          searchPlaceholder="Search products..."
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
              {displayProducts.map((product: Product, index: number) => (
                <div key={product._id} className="w-full max-w-sm mx-auto sm:max-w-full">
                  <UniversalCard 
                    type="product" 
                    data={product} 
                    priority={index < 4} // Priority for first 4 images
                  />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </section>
      </main>
      
      {/* Filter Modal */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        settings={settings}
        onChange={setSettings}
        onClear={() => setSettings({
          categories: [],
          colors: [],
          sizes: [],
          materials: [],
        })}
        filterType="products"
      />
      {displayProducts.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          No products found.
        </div>
      )}
    </div>
  );
}
