import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/sanity";

export async function GET(req: NextRequest) {
  // Получаем все id из query (?id=xxx&id=yyy)
  const ids = req.nextUrl.searchParams.getAll("id");
  if (!ids.length) {
    return NextResponse.json({ products: [], articles: [], recipes: [] });
  }

  // Запрашиваем все типы одним промисом
  const [products, articles, recipes] = await Promise.all([
    client.fetch(`*[_type == "product" && _id in $ids]{_id, title, description, price, category, mainImage {
      asset->{url},
      alt
    }}`, { ids }),
    client.fetch(`*[_type == "article" && _id in $ids]{_id, title, description, body, category, mainImage {
      asset->{url},
      alt
    }}`, { ids }),
    client.fetch(`*[_type == "recipe" && _id in $ids]{_id, title, description, ingredients, steps, category, mainImage {
      asset->{url},
      alt
    }}`, { ids }),
  ]);

  return NextResponse.json({ products, articles, recipes });
} 