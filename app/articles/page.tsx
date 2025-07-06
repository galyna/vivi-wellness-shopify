import { getArticles } from "@/lib/sanityApi";
import { Article } from "@/types";
import ArticlesCatalogClient from "./ArticlesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default async function ArticlesCatalogPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const articles: Article[] = await getArticles();
  const categories: string[] = Array.from(new Set(articles.map((a) => a.category).filter(Boolean))) as string[];
  const params = await searchParams;
  const selectedCategory = params?.category || '';
  return (
    <>
      {/* Hero-блок каталога статей */}
      <div className="max-w-7xl mx-auto  px-8 pt-12 pb-10 lg:px-16"> <CatalogHero id="hero-articles" /></div>
      <ArticlesCatalogClient articles={articles} categories={categories} selectedCategory={selectedCategory} />
    </>
  );
} 