import React from "react";
import { notFound } from "next/navigation";
import { getRecipeBySlug, getRecipes } from "@/lib/sanityApi";
import { PortableText } from "@portabletext/react";
import { Recipe } from "@/types";
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image'
import { client } from '@/lib/sanityApi'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe: Recipe | null = await getRecipeBySlug(slug);
  if (!recipe) return notFound();
  const urlFor = (src: SanityImageSource) => imageUrlBuilder(client).image(src)
  
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        {recipe.mainImage && (
          <Image
            src={urlFor(recipe.mainImage).width(800).height(400).auto('format').url()}
            alt={recipe.mainImage.alt || recipe.title}
            width={800}
            height={400}
            className="mb-4 rounded-xl"
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <div className="text-3xl font-bold text-charcoal mb-2">{recipe.title}</div>
        <div className="inline-block px-3 py-1 rounded-full bg-lemon text-charcoal font-accent text-xs mb-4">Recipe</div>
        {recipe.intro && <p className="text-gray-600 mb-4">{recipe.intro}</p>}
      </div>
      
      {/* Recipe details */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {recipe.duration && (
            <div className="text-center">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-bold text-charcoal">{recipe.duration}</div>
            </div>
          )}
          {recipe.difficulty && (
            <div className="text-center">
              <div className="text-sm text-gray-500">Difficulty</div>
              <div className="font-bold text-charcoal">{recipe.difficulty}</div>
            </div>
          )}
          {recipe.servings && (
            <div className="text-center">
              <div className="text-sm text-gray-500">Servings</div>
              <div className="font-bold text-charcoal">{recipe.servings}</div>
            </div>
          )}
        </div>
        
        {/* Ingredients */}
        <section className="mb-6">
          <h3 className="text-xl font-bold text-charcoal mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-coral rounded-full mr-3"></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </section>
        
        {/* Steps */}
        <section>
          <h3 className="text-xl font-bold text-charcoal mb-3">Instructions</h3>
          <PortableText value={recipe.steps} />
        </section>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className="px-5 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition">Ask Vivi</button>
      </div>
      
    </main>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const recipes: Recipe[] = await getRecipes();
  return recipes.map((recipe: Recipe) => ({ slug: recipe.slug }));
} 