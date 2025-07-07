import React from "react";
import { notFound } from "next/navigation";
import { getRecipeBySlug, getRecipes, getProductsByIds, getArticlesByIds } from "@/lib/sanityApi";
import { Recipe } from "@/types";
import Image from "next/image";
import AskViviButton from "../../components/content/AskViviButton";
import CardsSection from "@/app/components/sections/CardsSection";
import { Product, Article } from "@/types";

type CardItem = (Product | Article) & { _id: string; type: "product" | "article" };
type IdRef = string | { _id: string };

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe: Recipe | null = await getRecipeBySlug(slug);
  if (!recipe) return notFound();

  // Related products & articles
  const productIds: string[] = (recipe.productsIds as IdRef[] || []).map((p) => typeof p === 'string' ? p : p._id).filter(Boolean);
  const articleIds: string[] = (recipe.articlesIds as IdRef[] || []).map((a) => typeof a === 'string' ? a : a._id).filter(Boolean);

  const [relatedProducts, relatedArticles] = await Promise.all([
    getProductsByIds(productIds, 2),
    getArticlesByIds(articleIds, 2),
  ]);

  const relatedItems: CardItem[] = [
    ...relatedProducts.map((p: Product) => ({ ...p, type: "product" as const })),
    ...relatedArticles.map((a: Article) => ({ ...a, type: "article" as const })),
  ].slice(0, 2);

  return (
    <main className="max-w-7xl mx-auto px-8 py-14 lg:px-16">
      <section className="space-y-12">
        {/* Hero-блок */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between  rounded-3xl mb-10 shadow-lg overflow-hidden">
          {/* Image */}
          <div className="w-full md:w-1/2 h-48 md:h-auto aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0 relative">
            {recipe.mainImage?.asset?.url && (
              <Image
                src={recipe.mainImage.asset.url}
                alt={recipe.mainImage.alt || recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover w-full h-full"
                priority
              />
            )}
          </div>
          {/* Text */}
          <div className="flex-1 flex bg-[#222] flex-col justify-center items-start text-white p-6 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {recipe.title}
            </h1>
            {recipe.intro && <p className="text-lg mb-6">{recipe.intro}</p>}
            <div className="text-sm text-white/70 mb-4">
              {recipe.difficulty && <div>Difficulty: {recipe.difficulty}</div>}
            </div>
            {/* Кнопка */}
            <div className="mt-8 flex justify-end">
              <AskViviButton />
            </div>
          </div>
        </div>

        {/* Ингредиенты */}
        <div className="bg-white/70 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-charcoal">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-center">
                <span className="w-2 h-2 bg-coral rounded-full mr-3"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-charcoal">Instructions</h2>
          <ol className="space-y-8">
            {recipe.stepsWithContent?.map((step, idx) => (
              <li
                key={idx}
                className="flex flex-col md:flex-row items-stretch justify-between bg-white/70 rounded-2xl mb-8 shadow-lg overflow-hidden min-h-[140px]"
              >
                {/* Левая часть: номер + текст */}
                <div className="flex-1 flex flex-row items-center p-4 md:p-8 text-charcoal">
                  <div className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-lg md:text-xl font-medium text-charcoal text-left">
                    {step.text}
                  </div>
                </div>
                {/* Правая часть: картинка */}
                {step.image?.asset?.url && (
                  <div className="w-full md:w-1/3 h-50 md:h-auto aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={step.image.asset.url}
                      alt={step.image.alt || `Step ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
      {relatedItems.length > 0 && (
        <CardsSection
          title="Related"
          items={relatedItems}
          showTypeMarker
        />
      )}
    </main>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const recipes: Recipe[] = await getRecipes();
  return recipes.map((recipe: Recipe) => ({ slug: recipe.slug }));
}
