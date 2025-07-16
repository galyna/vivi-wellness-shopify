"use client";
import React from "react";
import { Article, Recipe, Product } from "@/types";
import UniversalCard from "../content/UniversalCard";
import ShowMoreButton from "../content/ShowMoreButton";

type CardType = "article" | "recipe" | "product";
type CardData = (Article | Recipe | Product) & { type: CardType; _id: string };

interface CardsSectionProps {
  title: string;
  items: CardData[];
  showMoreHref?: string;
  showMoreText?: string;
  showTypeMarker?: boolean;
}

function CardsSection({
  title,
  items,
  showMoreHref,
  showMoreText,
  showTypeMarker = false,
}: CardsSectionProps) {
  return (
    <div className="flex flex-col min-h-[200px] gap-12 lg:gap-16">
      <h2 className="text-2xl lg:text-3xl font-bold  text-charcoal tracking-wide capitalize letter-spacing text-center font-serif ">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 items-stretch">
        {items.map((item, idx) => (
          <div
            key={item._id ?? idx}
            className={`w-full max-w-sm mx-auto sm:max-w-full h-full ${
              idx === 2 ? "block md:hidden xl:block" : "block"
            }`}
          >
            <UniversalCard
              type={item.type}
              data={item}
              showTypeMarker={showTypeMarker}
              priority={idx < 4} // Priority for first 4 images
            />
          </div>
        ))}
      </div>
      {showMoreHref && showMoreText && (
        <div className="flex justify-center ">
          <ShowMoreButton href={showMoreHref}>{showMoreText}</ShowMoreButton>
        </div>
      )}
    </div>
  );
}

export default CardsSection;
