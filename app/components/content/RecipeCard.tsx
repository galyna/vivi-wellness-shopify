import React from "react";
import Link from "next/link";
import Image from "next/image";

interface RecipeCardProps {
  slug: string;
  title: string;
  image?: string;
  category: string;
  date?: string;
  ingredients?: string[];
  intro?: string;
  duration?: string;
  difficulty?: string;
  servings?: number;
}

const RecipeCard = ({ slug, title, image, category, date, ingredients, intro, duration, difficulty, servings }: RecipeCardProps) => {
  const img = image || "/placeholder.jpg";
  return (
    <Link href={`/recipes/${slug}`} className="block h-full group cursor-pointer">
      <div className="bg-softgray rounded-2xl shadow-md overflow-hidden flex flex-col h-full group-hover:shadow-lg transition">
        <div className="relative">
          <Image
            src={img}
            alt={title}
            width={400}
            height={320}
            className="w-full h-60 md:h-80 object-cover"
          />
          <span className="absolute top-3 left-3 bg-mint text-green-900 text-xs font-bold px-3 py-1 rounded">{category}</span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          {date && <div className="text-xs text-gray-400 mb-2">{date}</div>}
          <div className="font-bold text-lg text-charcoal mb-2">{title}</div>
          {intro && <div className="text-xs text-gray-500 mb-2 line-clamp-2">{intro}</div>}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
            {duration && <span>⏱ {duration}</span>}
            {difficulty && <span>• {difficulty}</span>}
            {servings !== undefined && <span>• {servings} servings</span>}
          </div>
          {ingredients && ingredients.length > 0 && (
            <div className="text-xs text-gray-500 mb-2 line-clamp-1">
              {ingredients.slice(0, 3).join(", ")}
            </div>
          )}
          <div className="mt-auto">
            <span className="text-coral font-semibold hover:underline">View Recipe</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard; 