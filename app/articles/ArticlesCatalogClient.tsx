"use client";
import { useRouter } from "next/navigation";
import ArticleCard from "../components/content/ArticleCard";
import { Article } from "@/types";
import Image from "next/image";

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
  const router = useRouter();
  const filtered = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;
  return (
    <main className=" relative">
      <Image
        src="/bg2.jpg"
        alt="Background"
        fill
        className="object-cover object-center opacity-15 blur-lg pointer-events-none select-none z-0"
        priority={false}
      />
      <section className=" mx-auto px-8 py-8 lg:px-16 relative z-10 space-y-10 lg:space-y-12">
        <h1 className="text-3xl font-bold mb-6 text-charcoal text-center">
          Articles Catalog
        </h1>
        <div className="mb-6 flex gap-2 items-center flex-wrap justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-bold border transition-colors ${
              !selectedCategory
                ? "bg-charcoal text-white"
                : "bg-white text-charcoal border-charcoal hover:bg-charcoal/10"
            }`}
            onClick={() => router.push(window.location.pathname)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-full font-bold border transition-colors ${
                selectedCategory === cat
                  ? "bg-charcoal text-white"
                  : "bg-white text-charcoal border-charcoal hover:bg-charcoal/10"
              }`}
              onClick={() => router.push(`?category=${cat}`)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
          {filtered.map((article) => (
            <ArticleCard
              key={article._id}
              slug={article.slug}
              title={article.title}
              description={
                typeof article.body === "string" ? article.body : "Read more..."
              }
              category={article.category || "Uncategorized"}
              image={article.mainImage?.asset?.url || "/placeholder.jpg"}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
