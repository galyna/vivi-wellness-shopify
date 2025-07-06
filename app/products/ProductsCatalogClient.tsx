"use client";
import { useState, useMemo, useEffect } from "react";
import { Product } from "@/types";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";

interface Props {
  products: Product[];
  categories: string[];
  selectedCategory: string;
}

export default function ProductsCatalogClient({ products, categories, selectedCategory }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ category?: string; minPrice?: number; maxPrice?: number }>({ category: selectedCategory });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  const filtered = useMemo(() => {
    let arr = products;
    if (activeFilters.category) arr = arr.filter(p => p.category === activeFilters.category);
    if (activeFilters.minPrice) arr = arr.filter(p => Number(p.price) >= (activeFilters.minPrice || 0));
    if (activeFilters.maxPrice) arr = arr.filter(p => Number(p.price) <= (activeFilters.maxPrice || Infinity));
    if (search) arr = arr.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    return arr.sort((a, b) =>
      sort === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }, [products, search, sort, activeFilters]);

  useEffect(() => {
    const onScroll = () => {
      setToolbarAtTop(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div className={`sticky ${toolbarAtTop ? "top-0 z-[999]" : "top-[56px] z-30"} bg-white`}>
        <CatalogToolbar
          onSearch={setSearch}
          onSort={v => setSort(v as "asc" | "desc")}
          onFilter={() => setFilterOpen(true)}
          filterCount={Object.keys(activeFilters).filter(k => activeFilters[k as keyof typeof activeFilters]).length}
          sortValue={sort}
          searchValue={search}
        />
      </div>
      <main>
        <section className="mx-auto max-w-7xl px-8 py-10 lg:px-16 relative space-y-10 lg:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-8 lg:gap-12">
            {(showAll ? filtered : filtered.slice(0, 8)).map((product) => (
              <UniversalCard
                key={product._id}
                type="product"
                data={product}
              />
            ))}
          </div>
          {!showAll && filtered.length > 9 && (
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition"
                onClick={() => setShowAll(true)}
              >
                Show more
              </button>
            </div>
          )}
        </section>
      </main>
      {filterOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-4 relative">
            <button
              className="absolute top-2 right-2 text-2xl text-coral"
              onClick={() => setFilterOpen(false)}
              aria-label="Close filter"
              type="button"
            >
              ×
            </button>
            <div className="font-bold mb-2">Category</div>
            {categories.map(cat => (
              <button
                key={cat}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                onClick={() => {
                  setActiveFilters(f => ({ ...f, category: cat }));
                  setFilterOpen(false);
                }}
              >
                {cat}
              </button>
            ))}
            <div className="font-bold mt-4 mb-2">Price</div>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Min"
                className="border rounded px-2 py-1 w-20"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="border rounded px-2 py-1 w-20"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
              <button
                className="px-3 py-1 bg-coral text-white rounded"
                onClick={() => {
                  setActiveFilters(f => ({
                    ...f,
                    minPrice: minPrice ? Number(minPrice) : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) : undefined,
                  }));
                  setFilterOpen(false);
                }}
              >
                Apply
              </button>
            </div>
            <button
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
              onClick={() => {
                setActiveFilters({});
                setMinPrice("");
                setMaxPrice("");
                setFilterOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-20">No products found.</div>
      )}
    </div>
  );
}
