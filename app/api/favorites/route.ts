import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/shopify-graphql";
import { getArticlesByIds, getRecipesByIds } from "@/lib/sanityApi";

export async function GET(req: NextRequest) {
  // Получаем все id из query (?id=xxx&id=yyy)
  const ids = req.nextUrl.searchParams.getAll("id");
  if (!ids.length) {
    return NextResponse.json({ products: [], articles: [], recipes: [] });
  }

  // Запрашиваем все типы одним промисом
  const [products, articles, recipes] = await Promise.all([
    getProductsByIds(ids),
    getArticlesByIds(ids),
    getRecipesByIds(ids),
  ]);

  return NextResponse.json({ products, articles, recipes });
}
