import React from "react";

interface TodayPickCardProps {
  title: string;
  description: string;
  category: string;
  image?: string;
}

const TodayPickCard = ({ title, description, category, image }: TodayPickCardProps) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-2 w-full max-w-xs hover:shadow-lg transition">
    <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center mb-2">
      {image ? <img src={image} alt={title} className="w-10 h-10 object-contain" /> : <span className="text-3xl">✨</span>}
    </div>
    <div className="text-lg font-bold text-charcoal text-center">{title}</div>
    <div className="text-sm text-charcoal/70 text-center">{description}</div>
    <div className="mt-2 text-xs px-3 py-1 rounded-full bg-lemon text-charcoal font-accent">{category}</div>
  </div>
);

export default TodayPickCard; 