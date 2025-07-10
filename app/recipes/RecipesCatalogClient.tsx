"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";
import FilterModal from "../components/content/FilterModal";
import InfiniteScroll from "../components/content/InfiniteScroll";
import { useInfiniteRecipes } from "../hooks/recipe/useInfiniteRecipes";
import { Skeleton } from "../components/sections/Skeleton";
import { Recipe } from "@/types";

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

  // Use infinite query for recipes
  const queryParams = useMemo(() => ({
    search,
    categories: settings.categories || [],
    times: settings.times || [],
    difficulties: settings.difficulties || [],
    sort,
  }), [search, settings, sort]);

  const {
    data: infiniteData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteRecipes(queryParams);

  // Используем данные из React Query
  const displayRecipes = infiniteData?.pages.flatMap(page => page.recipes) || [];



  if (isLoading) {
    return (
      <div>
        <div className="bg-white min-h-[64px]">
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
      <div className="bg-white min-h-[64px]">
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
      
        <section className=" mx-auto max-w-7xl px-8 py-12 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
          <InfiniteScroll
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage ?? false}
            isLoading={isFetchingNextPage}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayRecipes.map((recipe: Recipe) => (
                <div key={recipe._id} className="w-full max-w-sm mx-auto sm:max-w-full">
                  <UniversalCard type="recipe" data={recipe} />
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
        onChange={(newSettings) => setSettings(newSettings as RecipeFilterSettings)}
        onClear={() => {
          setSettings({ categories: [], times: [], difficulties: [] });
          setFilterOpen(false);
        }}
        filterType="recipes"
      />
      {displayRecipes.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          No recipes found.
        </div>
      )}
    </div>
  );
}
