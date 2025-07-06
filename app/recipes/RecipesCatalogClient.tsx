"use client";
import { useState, useMemo, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Recipe } from "@/types";
import Image from "next/image";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";

interface Props {
  recipes: Recipe[];
  categories: string[];
  selectedCategory: string;
}

export default function RecipesCatalogClient({
  recipes,
  categories,
  selectedCategory,
}: Props) {
  // const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ category?: string }>({
    category: selectedCategory,
  });
  const [showAll, setShowAll] = useState(false);
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  const filtered = useMemo(() => {
    let arr = recipes;
    if (activeFilters.category)
      arr = arr.filter((r) => r.category === activeFilters.category);
    if (search)
      arr = arr.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    return arr.sort((a, b) =>
      sort === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }, [recipes, search, sort, activeFilters]);

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
          onSort={(v) => setSort(v as "asc" | "desc")}
          onFilter={() => setFilterOpen(true)}
          filterCount={
            Object.keys(activeFilters).filter(
              (k) => activeFilters[k as keyof typeof activeFilters]
            ).length
          }
          sortValue={sort}
          searchValue={search}
        />
      </div>
      <main className=" relative">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover object-center opacity-15 blur-lg pointer-events-none select-none z-0"
          priority={false}
        />
        <section className=" mx-auto max-w-7xl px-8 py-12 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-8 lg:gap-12">
            {(showAll ? filtered : filtered.slice(0, 8)).map((recipe) => (
              <UniversalCard key={recipe._id} type="recipe" data={recipe} />
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
          <div className="bg-white w-full rounded-t-3xl p-4">
            <div className="font-bold mb-2">Category</div>
            {categories.map((cat) => (
              <button
                key={cat}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                onClick={() => {
                  setActiveFilters({ category: cat });
                  setFilterOpen(false);
                }}
              >
                {cat}
              </button>
            ))}
            <button
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100"
              onClick={() => {
                setActiveFilters({});
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
