import React from "react";
import Link from "next/link";
import Image from "next/image";

interface RecipeCardProps {
  slug: string;
  title: string;
  ingredients: string[];
  category: string;
  image?: string;
}

const RecipeCard = ({ slug, title, ingredients, category, image }: RecipeCardProps) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-2 w-full max-w-xs hover:shadow-lg transition">
    <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center mb-2">
      {image ? (
        <Image
          src={image}
          alt={title}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
      ) : (
        <span className="text-3xl">🥗</span>
      )}
    </div>
    <div className="text-lg font-bold text-charcoal text-center">{title}</div>
    <div className="text-xs text-charcoal/70 text-center mb-1">Ingredients: {ingredients.slice(0,2).join(", ")}...</div>
    <div className="mt-2 text-xs px-3 py-1 rounded-full bg-lemon text-charcoal font-accent">{category}</div>
    <Link href={`/recipes/${slug}`} className="mt-3 px-4 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition text-sm">View Recipe</Link>
  </div>
);

export default RecipeCard; 