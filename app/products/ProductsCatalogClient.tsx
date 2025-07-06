"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";
import FilterModal from "../components/content/FilterModal";
import { useProducts, useAllProducts } from "../hooks/useProducts";
import { Skeleton } from "../components/content/Skeleton";

type ProductFilterSettings = {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  minPrice?: string;
  maxPrice?: string;
};

export default function ProductsCatalogClient() {
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
  const [showAll, setShowAll] = useState(false);
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  // Use React Query hooks
  const { data: products = [], isLoading, error } = useProducts({
    search,
    categories: settings.categories || [],
    colors: settings.colors || [],
    sizes: settings.sizes || [],
    materials: settings.materials || [],
    minPrice: settings.minPrice || "",
    maxPrice: settings.maxPrice || "",
    sort,
  });

  // Get all products for filter options
  const { data: allProducts = [] } = useAllProducts();

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
      <main>
        <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16 relative space-y-10 lg:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-8 lg:gap-12">
            {(showAll ? products : products.slice(0, 8)).map((product) => (
              <UniversalCard key={product._id} type="product" data={product} />
            ))}
          </div>
          {!showAll && products.length > 9 && (
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-3 rounded-full bg-charcoal text-white font-bold hover:bg-gray-800
             transition-all duration-200 transform hover:scale-105 flex items-center gap-2 group"
                onClick={() => setShowAll(true)}
              >
                Show more{" "}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </section>
      </main>
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        data={allProducts}
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
      {products.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          No products found.
        </div>
      )}
    </div>
  );
}
