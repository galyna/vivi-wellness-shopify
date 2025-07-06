"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";
import FilterModal from "../components/content/FilterModal";
import ShowMoreButton from "../components/content/ShowMoreButton";
import { useRecipes, useAllRecipes } from "../hooks/useRecipes";
import { Skeleton } from "../components/sections/Skeleton";

type RecipeFilterSettings = {
  categories?: string[];
  times?: string[];
  difficulties?: string[];
};

export default function RecipesCatalogClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settings, setSettings] = useState<RecipeFilterSettings>({
    categories: selectedCategory ? [selectedCategory] : [],
    times: [],
    difficulties: [],
  });
  const [showAll, setShowAll] = useState(false);
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  // Use React Query hooks
  const { data: recipes = [], isLoading, error } = useRecipes({
    search,
    categories: settings.categories || [],
    times: settings.times || [],
    difficulties: settings.difficulties || [],
    sort,
  });

  // Get all recipes for filter options
  const { data: allRecipes = [] } = useAllRecipes();

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
        <div className={`sticky top-[64px] z-30 bg-white min-h-[64px]`}>
          <CatalogToolbar
            onSearch={setSearch}
            onSort={(v) => setSort(v as "asc" | "desc")}
            onFilter={() => setFilterOpen(true)}
            filterCount={(settings.categories?.length || 0) + (settings.times?.length || 0) + (settings.difficulties?.length || 0)}
            sortValue={sort}
            searchValue={search}
          />
        </div>
        <main className="relative">
          <section className="mx-auto max-w-7xl px-8 py-12 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
            <Skeleton />
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">Error loading recipes</div>
      </div>
    );
  }

  return (
    <div>
      <div className={`sticky ${toolbarAtTop ? "top-0 z-[999]" : "top-[64px] z-30"} bg-white min-h-[64px]`}>
        <CatalogToolbar
          onSearch={setSearch}
          onSort={(v) => setSort(v as "asc" | "desc")}
          onFilter={() => setFilterOpen(true)}
          filterCount={(settings.categories?.length || 0) + (settings.times?.length || 0) + (settings.difficulties?.length || 0)}
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
            {(showAll ? recipes : recipes.slice(0, 8)).map((recipe) => (
              <UniversalCard key={recipe._id} type="recipe" data={recipe} />
            ))}
          </div>
          {!showAll && recipes.length > 9 && (
            <div className="flex justify-center mt-6">
              <ShowMoreButton onClick={() => setShowAll(true)}>
                Show more
              </ShowMoreButton>
            </div>
          )}
        </section>
      </main>
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        data={allRecipes}
        settings={settings}
        onChange={(newSettings) => setSettings(newSettings as RecipeFilterSettings)}
        onClear={() => {
          setSettings({ categories: [], times: [], difficulties: [] });
          setFilterOpen(false);
        }}
        filterType="recipes"
      />
      {recipes.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          No recipes found.
        </div>
      )}
    </div>
  );
}
