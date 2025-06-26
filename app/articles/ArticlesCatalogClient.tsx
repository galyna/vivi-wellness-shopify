"use client";
import { useRouter } from "next/navigation";
import ArticleCard from "../components/content/ArticleCard";
import { Article } from "@/types";

interface Props {
  articles: Article[];
  categories: string[];
  selectedCategory: string;
}

export default function ArticlesCatalogClient({ articles, categories, selectedCategory }: Props) {
  const router = useRouter();
  const filtered = selectedCategory ? articles.filter((a) => a.category === selectedCategory) : articles;
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-charcoal">Articles Catalog</h1>
      <form className="mb-6 flex gap-4 items-center">
        <label htmlFor="category" className="font-bold">Category:</label>
        <select
          id="category"
          name="category"
          className="border rounded px-3 py-2"
          value={selectedCategory}
          onChange={e => {
            router.push(e.target.value ? `?category=${e.target.value}` : "");
          }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </form>
      <div className="flex flex-wrap gap-6 justify-center">
        {filtered.map((article) => (
          <ArticleCard
            key={article._id}
            slug={article.slug}
            title={article.title}
            description={typeof article.body === 'string' ? article.body : 'Read more...'}
            category={article.category || 'Uncategorized'}
            image={article.mainImage?.asset?.url || "/placeholder.jpg"}
          />
        ))}
      </div>
    </main>
  );
} 