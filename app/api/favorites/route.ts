import { NextRequest, NextResponse } from "next/server";
import { getProductsByHandles } from "@/lib/shopify-graphql";
import { getArticlesBySlugs, getRecipesBySlugs } from "@/lib/sanityApi";

export async function GET(req: NextRequest) {
  // Получаем все slug из query (?id=xxx&id=yyy)
  const slugs = req.nextUrl.searchParams.getAll("id");
  if (!slugs.length) {
    return NextResponse.json({ products: [], articles: [], recipes: [] });
  }

  // Запрашиваем все типы одним промисом
  const [products, articles, recipes] = await Promise.all([
    getProductsByHandles(slugs),
    getArticlesBySlugs(slugs),
    getRecipesBySlugs(slugs),
  ]);

  return NextResponse.json({ products, articles, recipes });
}
