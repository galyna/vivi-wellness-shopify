import React from "react";
import { notFound } from "next/navigation";
import { getRecipeBySlug, getRecipes } from "@/lib/sanityApi";
import { Recipe } from "@/types";
import Image from "next/image";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe: Recipe | null = await getRecipeBySlug(slug);
  if (!recipe) return notFound();

  return (
    <main className="max-w-7xl mx-auto  px-8 py-8 lg:px-16">
      {/* Hero-блок */}
      <section className="w-full flex flex-col md:flex-row items-stretch justify-between  rounded-3xl mb-10 shadow-lg overflow-hidden">
        {/* Image */}
        <div className="w-full md:w-1/2 h-48 md:h-auto aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0 relative">
          {recipe.mainImage?.asset?.url && (
            <Image
              src={recipe.mainImage.asset.url}
              alt={recipe.mainImage.alt || recipe.title}
              fill
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
            <a
              href="/chat"
              className="inline-flex items-center px-8 py-3 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-[#222] transition"
            >
              Ask Vivi
              <span className="ml-2 text-xl">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Ингредиенты */}
      <section className="bg-white/70 rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, idx) => (
            <li key={idx} className="flex items-center">
              <span className="w-2 h-2 bg-coral rounded-full mr-3"></span>
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section>
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
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const recipes: Recipe[] = await getRecipes();
  return recipes.map((recipe: Recipe) => ({ slug: recipe.slug }));
}
