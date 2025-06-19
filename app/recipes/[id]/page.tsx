import React from "react";
import { notFound } from "next/navigation";
import { getRecipeBySlug } from "@/lib/sanityApi";
import { PortableText } from "@portabletext/react";

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeBySlug(params.id);
  if (!recipe) return notFound();
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <div className="text-3xl font-bold text-charcoal mb-2">{recipe.title}</div>
        <div className="inline-block px-3 py-1 rounded-full bg-lemon text-charcoal font-accent text-xs mb-4">Recipe</div>
      </div>
      <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="font-bold mb-2">Ingredients:</div>
        <ul className="list-disc list-inside mb-4">
          {recipe.ingredients.map((ing: string, i: number) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
        <div className="font-bold mb-2">Steps:</div>
        <PortableText value={recipe.steps} />
      </section>
      <div className="mt-8 flex justify-end">
        <button className="px-5 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition">Ask Vivi</button>
      </div>
    </main>
  );
} 