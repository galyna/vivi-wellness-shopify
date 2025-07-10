"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";
import FilterModal from "../components/content/FilterModal";
import InfiniteScroll from "../components/content/InfiniteScroll";
import { useInfiniteArticles } from "../hooks/article/useInfiniteArticles";
import { Skeleton } from "../components/sections/Skeleton";
import { Article } from "@/types";

type ArticleFilterSettings = {
  categories?: string[];
  lengths?: string[];
  tones?: string[];
  authors?: string[];
  dateFrom?: string;
  dateTo?: string;
};



export default function ArticlesCatalogClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<ArticleFilterSettings>({
    categories: selectedCategory ? [selectedCategory] : [],
    lengths: [],
    tones: [],
    authors: [],
    dateFrom: "",
    dateTo: "",
  });
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  // Use infinite query for articles
  const queryParams = useMemo(() => ({
    search,
    categories: activeFilters.categories || [],
    lengths: activeFilters.lengths || [],
    tones: activeFilters.tones || [],
    authors: activeFilters.authors || [],
    dateFrom: activeFilters.dateFrom || "",
    dateTo: activeFilters.dateTo || "",
    sort,
  }), [search, activeFilters, sort]);
  

  
  const {
    data: infiniteData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteArticles(queryParams);


  


  // Используем данные из React Query
  const displayArticles = infiniteData?.pages.flatMap(page => page.articles) || [];
  




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
            filterCount={
              (activeFilters.categories?.length || 0) +
              (activeFilters.lengths?.length || 0) +
              (activeFilters.tones?.length || 0) +
              (activeFilters.authors?.length || 0) +
              (activeFilters.dateFrom ? 1 : 0) +
              (activeFilters.dateTo ? 1 : 0)
            }
            sortValue={sort}
            searchValue={search}
          />
        </div>
        <main className="relative">
          <Image
            src="/bg2.jpg"
            alt="Background"
            fill
            className="object-cover object-center opacity-15 blur-lg pointer-events-none select-none z-0"
            priority={false}
          />
          <section className="max-w-7xl mx-auto px-8 py-12 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
            <Skeleton />
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-500">Error loading articles</div>
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
          filterCount={
            (activeFilters.categories?.length || 0) +
            (activeFilters.lengths?.length || 0) +
            (activeFilters.tones?.length || 0) +
            (activeFilters.authors?.length || 0) +
            (activeFilters.dateFrom ? 1 : 0) +
            (activeFilters.dateTo ? 1 : 0)
          }
          sortValue={sort}
          searchValue={search}
        />
      </div>
      <main className=" relative">
        <section className=" max-w-7xl mx-auto px-8 py-12 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
          <InfiniteScroll
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage ?? false}
            isLoading={isFetchingNextPage}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayArticles.map((article: Article) => (
                <div key={article._id} className="w-full max-w-sm mx-auto sm:max-w-full">
                  <UniversalCard type="article" data={article} />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </section>
      </main>
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        settings={activeFilters}
        onChange={(newSettings) => {
          setActiveFilters(newSettings as ArticleFilterSettings);
        }}
        onClear={() => {
          const clearedSettings = {
            categories: [],
            lengths: [],
            tones: [],
            authors: [],
            dateFrom: "",
            dateTo: "",
          };
          setActiveFilters(clearedSettings);
          setFilterOpen(false);
        }}
        filterType="articles"
      />
      {displayArticles.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          No articles found.
        </div>
      )}
    </div>
  );
}
