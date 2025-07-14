import React from "react";
import { getProductBySlug, getArticlesByIds, getRecipesByIds } from "@/lib/sanityApi";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import CardsSection from "@/app/components/sections/CardsSection";
import { Article, Recipe } from "@/types";

type CardItem = (Article | Recipe) & { _id: string; type: "article" | "recipe" };
type IdRef = string | { _id: string };

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const gallery: string[] = [
    product.mainImage?.asset?.url,
    ...(product.galleryImages?.map((img: { asset?: { url?: string } }) => img.asset?.url) || [])
  ].filter(Boolean) as string[];

  // Related content
  const articleIds: string[] = (product.articlesIds as IdRef[] || []).map((a) => typeof a === 'string' ? a : a._id).filter(Boolean);
  const recipeIds: string[] = (product.recipesIds as IdRef[] || []).map((r) => typeof r === 'string' ? r : r._id).filter(Boolean);

  const [relatedArticles, relatedRecipes] = await Promise.all([
    getArticlesByIds(articleIds, 2),
    getRecipesByIds(recipeIds, 2),
  ]);

  const relatedItems: CardItem[] = [
    ...relatedArticles.map((a: Article) => ({ ...a, type: "article" as const })),
    ...relatedRecipes.map((r: Recipe) => ({ ...r, type: "recipe" as const })),
  ].slice(0, 2);

  return (
    <>
      <ProductPageClient product={product} gallery={gallery} />
      {relatedItems.length > 0 && (
        <section className=" max-w-7xl mx-auto relative">
          <div className="px-8 lg:px-16 py-12 lg:py-16">
        <CardsSection
          title="Related"
          items={relatedItems}
          showTypeMarker
        />
        </div>
        </section>
      )}
    </>
  );
} 