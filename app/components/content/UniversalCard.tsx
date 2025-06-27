import Image from "next/image";
import Link from "next/link";
import { Article, Recipe, Product } from "@/types";

type CardType = "article" | "recipe" | "product";

interface UniversalCardProps<T extends CardType = CardType> {
  type: T;
  data: T extends "article" ? Article : T extends "recipe" ? Recipe : Product;
}

const UniversalCard = <T extends CardType>({
  type,
  data,
}: UniversalCardProps<T>) => {
  if (!data) return null;
  // Универсальные поля
  const slug = data.slug;
  const title = data.title;
  let image = "/placeholder.jpg";
  if ("image" in data && typeof data.image === "string") image = data.image;
  else if ("cardImage" in data && data.cardImage?.asset?.url)
    image = data.cardImage.asset.url;
  else if ("mainImage" in data && data.mainImage?.asset?.url)
    image = data.mainImage.asset.url;
  const category = data.category || "Uncategorized";

  // Ссылки
  const href =
    type === "article"
      ? `/articles/${slug}`
      : type === "recipe"
      ? `/recipes/${slug}`
      : `/products/${slug}`;

  return (
    <Link href={href} className="block h-full group cursor-pointer">
      <div className="bg-softgray rounded-2xl shadow-md overflow-hidden flex flex-col h-full group-hover:shadow-lg transition">
        <div
          className={`relative ${
            type === "product" ? "h-60 md:h-80 w-full" : ""
          }`}
        >
          <Image
            src={image}
            alt={title}
            width={type === "product" ? undefined : 400}
            height={type === "product" ? undefined : 320}
            fill={type === "product"}
            className={`object-cover object-center w-full ${
              type !== "product" ? "h-60 md:h-80" : ""
            }`}
          />
          <span className="absolute top-3 left-3 bg-mint text-green-900 text-xs font-bold px-3 py-1 rounded">
            {category}
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          {/* Специфичные поля */}
          {type === "product" && (
            <div className="text-md text-coral font-bold mb-2">
              ${(data as Product).price}
            </div>
          )}
          <div className="font-bold text-lg text-charcoal mb-1">{title}</div>
          {type === "article" && (data as Article).intro && (
            <div className="text-xs text-gray-500 mb-2 line-clamp-2">
              {(data as Article).intro}
            </div>
          )}
          {type === "recipe" && (data as Recipe).intro && (
            <div className="text-xs text-gray-500 mb-2 line-clamp-2">
              {(data as Recipe).intro}
            </div>
          )}
          {type === "recipe" && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
              {(data as Recipe).duration && (
                <span>⏱ {(data as Recipe).duration}</span>
              )}
              {(data as Recipe).difficulty && (
                <span>• {(data as Recipe).difficulty}</span>
              )}
              {(data as Recipe).servings !== undefined && (
                <span>• {(data as Recipe).servings} servings</span>
              )}
            </div>
          )}
          {type === "recipe" &&
            (data as Recipe).ingredients &&
            (data as Recipe).ingredients.length > 0 && (
              <div className="text-xs text-gray-500 mb-2 line-clamp-1">
                {(data as Recipe).ingredients.slice(0, 3).join(", ")}
              </div>
            )}
          {type === "product" && (data as Product).description && (
            <div className="text-sm text-gray-500 mb-2 line-clamp-2">
              {(data as Product).description}
            </div>
          )}
          <div className="mt-auto">
            <span className="text-coral font-semibold hover:underline">
              {type === "article"
                ? "Read More"
                : type === "recipe"
                ? "View Recipe"
                : "View Product"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UniversalCard;
