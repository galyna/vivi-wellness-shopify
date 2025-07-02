"use client";
import { useState, useMemo, useEffect } from "react";
import { Article } from "@/types";
import Image from "next/image";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";

interface Props {
  articles: Article[];
  categories: string[];
  selectedCategory: string;
}

export default function ArticlesCatalogClient({
  articles,
  categories,
  selectedCategory,
}: Props) {
  // const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ category?: string; dateFrom?: string; dateTo?: string }>({ category: selectedCategory });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  const filtered = useMemo(() => {
    let arr = articles;
    if (activeFilters.category) arr = arr.filter(a => a.category === activeFilters.category);
    if (activeFilters.dateFrom) arr = arr.filter(a => new Date(a.publishedAt ?? a._createdAt ?? 0) >= new Date(activeFilters.dateFrom!));
    if (activeFilters.dateTo) arr = arr.filter(a => new Date(a.publishedAt ?? a._createdAt ?? 0) <= new Date(activeFilters.dateTo!));
    if (search) arr = arr.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    return arr.sort((a, b) =>
      sort === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }, [articles, search, sort, activeFilters]);

  useEffect(() => {
    const onScroll = () => {
      setToolbarAtTop(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div className={`sticky ${toolbarAtTop ? "top-0 z-[999]" : "top-[64px] z-30"} bg-white min-h-[64px]`}>
        <CatalogToolbar
          onSearch={setSearch}
          onSort={v => setSort(v as "asc" | "desc")}
          onFilter={() => setFilterOpen(true)}
          filterCount={Object.keys(activeFilters).filter(k => activeFilters[k as keyof typeof activeFilters]).length}
          sortValue={sort}
          searchValue={search}
        />
      </div>
      <main className=" relative">
        <Image
          src="/bg2.jpg"
          alt="Background"
          fill
          className="object-cover object-center opacity-15 blur-lg pointer-events-none select-none z-0"
          priority={false}
        />
        <section className=" max-w-7xl mx-auto px-8 py-8 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-8 lg:gap-12">
            {(showAll ? filtered : filtered.slice(0, 8)).map((article) => (
              <UniversalCard
                key={article._id}
                type="article"
                data={article}
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
            <div className="font-bold mt-4 mb-2">Date published</div>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                className="border rounded px-2 py-1 w-32"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
              <input
                type="date"
                className="border rounded px-2 py-1 w-32"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
              <button
                className="px-3 py-1 bg-coral text-white rounded"
                onClick={() => {
                  setActiveFilters(f => ({
                    ...f,
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
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
                setDateFrom("");
                setDateTo("");
                setFilterOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
