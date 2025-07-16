import React from "react";
import { getArticlesByIds, getRecipesByIds } from "@/lib/sanityApi";
import { getProductByHandle } from "@/lib/shopify-graphql";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import CardsSection from "@/app/components/sections/CardsSection";
import { Article, Recipe } from "@/types";

type CardItem = (Article | Recipe) & { _id: string; type: "article" | "recipe" };

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) return notFound();
  
  const gallery: string[] = product.images || [];

  // Related content - for now, we'll get recent articles and recipes
  // In the future, you might want to add related content fields to Shopify products
  const [relatedArticles, relatedRecipes] = await Promise.all([
    getArticlesByIds([], 2), // Empty array for now, will get recent articles
    getRecipesByIds([], 2), // Empty array for now, will get recent recipes
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