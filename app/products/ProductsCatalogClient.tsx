"use client";
import { useState, useEffect, useMemo } from "react";
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
  minPrice?: string;
  maxPrice?: string;
};

interface ProductsCatalogClientProps {
  initialProducts: Product[];
}

export default function ProductsCatalogClient({ }: ProductsCatalogClientProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settings, setSettings] = useState<ProductFilterSettings>({
    categories: selectedCategory ? [selectedCategory] : [],
    colors: [],
    sizes: [],
    materials: [],
    minPrice: "",
    maxPrice: "",
  });
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  // Use infinite query for products
  const queryParams = useMemo(() => ({
    search,
    categories: settings.categories || [],
    colors: settings.colors || [],
    sizes: settings.sizes || [],
    materials: settings.materials || [],
    minPrice: settings.minPrice || "",
    maxPrice: settings.maxPrice || "",
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



  useEffect(() => {
    const onScroll = () => {
      setToolbarAtTop(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="sticky top-[56px] z-30 bg-white">
          <CatalogToolbar
            onSearch={setSearch}
            onSort={(v) => setSort(v as "asc" | "desc")}
            onFilter={() => setFilterOpen(true)}
            filterCount={
              (settings.categories?.length || 0) +
              (settings.colors?.length || 0) +
              (settings.sizes?.length || 0) +
              (settings.materials?.length || 0) +
              (settings.minPrice ? 1 : 0) +
              (settings.maxPrice ? 1 : 0)
            }
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
      <div
        className={`sticky ${
          toolbarAtTop ? "top-0 z-[999]" : "top-[56px] z-30"
        } bg-white`}
      >
        <CatalogToolbar
          onSearch={setSearch}
          onSort={(v) => setSort(v as "asc" | "desc")}
          onFilter={() => setFilterOpen(true)}
          filterCount={
            (settings.categories?.length || 0) +
            (settings.colors?.length || 0) +
            (settings.sizes?.length || 0) +
            (settings.materials?.length || 0) +
            (settings.minPrice ? 1 : 0) +
            (settings.maxPrice ? 1 : 0)
          }
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
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        settings={settings}
        onChange={(newSettings) => setSettings(newSettings as ProductFilterSettings)}
        onClear={() => {
          setSettings({
            categories: [],
            colors: [],
            sizes: [],
            materials: [],
            minPrice: "",
            maxPrice: "",
          });
          setFilterOpen(false);
        }}
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
