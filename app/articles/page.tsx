import { getArticles } from "@/lib/sanityApi";
import { Article } from "@/types";
import ArticlesCatalogClient from "./ArticlesCatalogClient";

export default async function ArticlesCatalogPage({ searchParams }: { searchParams?: { category?: string } }) {
  const articles: Article[] = await getArticles();
  const categories: string[] = Array.from(new Set(articles.map((a) => a.category).filter(Boolean))) as string[];
  const selectedCategory = searchParams?.category || '';
  return <ArticlesCatalogClient articles={articles} categories={categories} selectedCategory={selectedCategory} />;
} 