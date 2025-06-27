import { getArticles } from "@/lib/sanityApi";
import { Article } from "@/types";
import ArticlesCatalogClient from "./ArticlesCatalogClient";
import CatalogHero from "../components/layout/CatalogHero";

export default async function ArticlesCatalogPage({ searchParams }: { searchParams?: { category?: string } }) {
  const articles: Article[] = await getArticles();
  const categories: string[] = Array.from(new Set(articles.map((a) => a.category).filter(Boolean))) as string[];
  const selectedCategory = searchParams?.category || '';
  return (
    <>
      {/* Hero-блок каталога статей */}
      <CatalogHero id="hero-articles" />
      <ArticlesCatalogClient articles={articles} categories={categories} selectedCategory={selectedCategory} />
    </>
  );
} 