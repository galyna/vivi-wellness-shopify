import React from "react";
import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  image?: string;
}

const ArticleCard = ({ slug, title, description, category, image }: ArticleCardProps) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-2 w-full max-w-xs hover:shadow-lg transition">
    <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center mb-2">
      {image ? <img src={image} alt={title} className="w-10 h-10 object-contain" /> : <span className="text-3xl">📖</span>}
    </div>
    <div className="text-lg font-bold text-charcoal text-center">{title}</div>
    <div className="text-sm text-charcoal/70 text-center">{description}</div>
    <div className="mt-2 text-xs px-3 py-1 rounded-full bg-lemon text-charcoal font-accent">{category}</div>
    <Link href={`/articles/${slug}`} className="mt-3 px-4 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition text-sm">Read</Link>
  </div>
);

export default ArticleCard; 