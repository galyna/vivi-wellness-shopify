"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import UniversalCard from "../components/content/UniversalCard";
import CatalogToolbar from "../components/content/CatalogToolbar";
import FilterModal from "../components/content/FilterModal";
import { useArticles, useAllArticles } from "../hooks/useArticles";
import { Skeleton } from "../components/content/Skeleton";

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
  const [filterSettings, setFilterSettings] = useState<ArticleFilterSettings>({
    categories: selectedCategory ? [selectedCategory] : [],
    lengths: [],
    tones: [],
    authors: [],
    dateFrom: "",
    dateTo: "",
  });
  const [showAll, setShowAll] = useState(false);
  const [toolbarAtTop, setToolbarAtTop] = useState(false);

  // Use React Query hooks
  const { data: articles = [], isLoading, error } = useArticles({
    search,
    categories: filterSettings.categories || [],
    lengths: filterSettings.lengths || [],
    tones: filterSettings.tones || [],
    authors: filterSettings.authors || [],
    dateFrom: filterSettings.dateFrom || "",
    dateTo: filterSettings.dateTo || "",
    sort,
  });

  // Get all articles for filter options
  const { data: allArticles = [] } = useAllArticles();

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
              (filterSettings.categories?.length || 0) +
              (filterSettings.lengths?.length || 0) +
              (filterSettings.tones?.length || 0) +
              (filterSettings.authors?.length || 0) +
              (filterSettings.dateFrom ? 1 : 0) +
              (filterSettings.dateTo ? 1 : 0)
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
      <div
        className={`sticky ${
          toolbarAtTop ? "top-0 z-[999]" : "top-[64px] z-30"
        } bg-white min-h-[64px]`}
      >
        <CatalogToolbar
          onSearch={setSearch}
          onSort={(v) => setSort(v as "asc" | "desc")}
          onFilter={() => setFilterOpen(true)}
          filterCount={
            (filterSettings.categories?.length || 0) +
            (filterSettings.lengths?.length || 0) +
            (filterSettings.tones?.length || 0) +
            (filterSettings.authors?.length || 0) +
            (filterSettings.dateFrom ? 1 : 0) +
            (filterSettings.dateTo ? 1 : 0)
          }
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
        <section className=" max-w-7xl mx-auto px-8 py-12 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4 md:gap-8 lg:gap-12">
            {(showAll ? articles : articles.slice(0, 8)).map((article) => (
              <UniversalCard key={article._id} type="article" data={article} />
            ))}
          </div>
          {!showAll && articles.length > 9 && (
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
              <FilterModal
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          data={allArticles}
          settings={filterSettings}
          onChange={(newSettings) => setFilterSettings(newSettings as ArticleFilterSettings)}
          onClear={() => {
            setFilterSettings({
              categories: [],
              lengths: [],
              tones: [],
              authors: [],
              dateFrom: "",
              dateTo: "",
            });
            setFilterOpen(false);
          }}
          filterType="articles"
        />
    </div>
  );
}
