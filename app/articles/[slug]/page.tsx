import React from "react";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getRecipesByIds,
} from "@/lib/sanityApi";
import { getProductsByHandles } from "@/lib/shopify-graphql";
import { PortableText } from "@portabletext/react";
import { Article } from "@/types";
import Image from "next/image";
import AskViviButton from "../../components/content/AskViviButton";
import CardsSection from "@/app/components/sections/CardsSection";
import { Product, Recipe } from "@/types";

type CardItem = (Product | Recipe) & {
  _id: string;
  type: "product" | "recipe";
};
type ArticleRef = string | { _id: string };

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article: Article | null = await getArticleBySlug(slug);
  if (!article) return notFound();

  // Related products & recipes
  const productHandles: string[] = (article.shopifyProductHandles || [])
    .filter(Boolean);
  const recipeIds: string[] = ((article.recipesIds as ArticleRef[]) || [])
    .map((r) => (typeof r === "string" ? r : r._id))
    .filter(Boolean);

  const [relatedProducts, relatedRecipes] = await Promise.all([
    getProductsByHandles(productHandles),
    getRecipesByIds(recipeIds, 2),
  ]);

  const relatedItems: CardItem[] = [
    ...relatedProducts.map((p: Product) => ({
      ...p,
      type: "product" as const,
    })),
    ...relatedRecipes.map((r: Recipe) => ({ ...r, type: "recipe" as const })),
  ].slice(0, 2);

  return (
    <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12 lg:py-16">
      <section className="w-full flex flex-col md:flex-row items-stretch justify-between rounded-3xl mb-14 shadow-lg overflow-hidden">
        {/* Image block — сверху на мобиле, справа на десктопе */}
        <div className="w-full md:w-1/2 h-48 md:h-auto aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0 relative">
          {article.mainImage?.asset?.url && (
            <Image
              src={article.mainImage.asset.url}
              alt={article.mainImage.alt || article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover w-full h-full"
              priority
            />
          )}
        </div>
        {/* Text block */}
        <div className="flex-1 flex flex-col justify-center items-start text-white p-14 bg-[#222]">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {article.title}
          </h1>
          {article.intro && <p className="text-lg mb-6">{article.intro}</p>}
          <div className="text-sm text-white/70 mb-4">
            {article.author && <span>By {article.author}</span>}
            {article.author && article.date && <span className="mx-2">|</span>}
            {article.date && (
              <span>{new Date(article.date).toLocaleDateString()}</span>
            )}
          </div>
          <div className="mt-8 flex justify-end">
            <AskViviButton />
          </div>
        </div>
      </section>

      {/* Параграфы */}
      <section className="space-y-16">
        {article.paragraphs?.map((p, i) => (
          <div key={i} className="w-full">
            {p.image?.asset?.url && (
              <Image
                src={p.image.asset.url}
                alt={p.image.alt || p.title || "Article image"}
                width={600}
                height={424}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`w-full md:w-1/2 h-auto object-cover rounded-xl shadow-md mb-10 ${
                  i % 2 === 0
                    ? "md:float-right md:ml-12"
                    : "md:float-left md:mr-12"
                } md:mb-8`}
              />
            )}
            <div className="text-left">
              {p.title && (
                <h2 className="text-4xl font-semibold mb-6 text-charcoal">
                  {p.title}
                </h2>
              )}
              {p.body && (
                <div className="text-xl leading-relaxed text-gray-800 space-y-6">
                  {/* Строки */}
                  {Array.isArray(p.body) &&
                    p.body
                      .filter((x) => typeof x === "string")
                      .map((str, idx) => <p key={"str-" + idx}>{str}</p>)}
                  {/* PortableText-блоки */}
                  {Array.isArray(p.body) &&
                    p.body.some((x) => typeof x === "object") && (
                      <PortableText
                        value={p.body.filter((x) => typeof x === "object")}
                      />
                    )}
                </div>
              )}
            </div>
            <div className="clear-both" />
          </div>
        ))}
      </section>
      {relatedItems.length > 0 && (
        <section className="pt-12">
          <CardsSection title="Related" items={relatedItems} showTypeMarker />
        </section>
      )}
    </main>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles: Article[] = await getArticles();
  return articles.map((article: Article) => ({ slug: article.slug }));
}
