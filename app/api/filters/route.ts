import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/sanity";

interface ArticleFilterData {
  category?: string;
  length?: string;
  tone?: string;
  author?: string;
}

interface ProductFilterData {
  category?: string;
  color?: string;
  size?: string;
  material?: string;
  price?: number;
}

interface RecipeFilterData {
  category?: string;
  time?: string;
  difficulty?: string;
}

interface FilterResponse {
  categories: string[];
  lengths?: string[];
  tones?: string[];
  authors?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  times?: string[];
  difficulties?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type || !["articles", "products", "recipes"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type parameter. Must be 'articles', 'products', or 'recipes'" },
      { status: 400 }
    );
  }

  try {
    let filters: FilterResponse = { categories: [] };

    if (type === "articles") {
      const articles = await client.fetch<ArticleFilterData[]>(`
        *[_type == "article"] {
          category,
          length,
          tone,
          author
        }
      `);

      filters = {
        categories: [...new Set(articles.map((a) => a.category).filter((x): x is string => Boolean(x)))],
        lengths: [...new Set(articles.map((a) => a.length).filter((x): x is string => Boolean(x)))],
        tones: [...new Set(articles.map((a) => a.tone).filter((x): x is string => Boolean(x)))],
        authors: [...new Set(articles.map((a) => a.author).filter((x): x is string => Boolean(x)))],
      };
    } else if (type === "products") {
      const products = await client.fetch<ProductFilterData[]>(`
        *[_type == "product"] {
          category,
          color,
          size,
          material,
          price
        }
      `);

      filters = {
        categories: [...new Set(products.map((p) => p.category).filter((x): x is string => Boolean(x)))],
        colors: [...new Set(products.map((p) => p.color).filter((x): x is string => Boolean(x)))],
        sizes: [...new Set(products.map((p) => p.size).filter((x): x is string => Boolean(x)))],
        materials: [...new Set(products.map((p) => p.material).filter((x): x is string => Boolean(x)))],
        priceRange: {
          min: Math.min(...products.map((p) => p.price || 0)),
          max: Math.max(...products.map((p) => p.price || 0)),
        },
      };
    } else if (type === "recipes") {
      const recipes = await client.fetch<RecipeFilterData[]>(`
        *[_type == "recipe"] {
          category,
          time,
          difficulty
        }
      `);

      filters = {
        categories: [...new Set(recipes.map((r) => r.category).filter((x): x is string => Boolean(x)))],
        times: [...new Set(recipes.map((r) => r.time).filter((x): x is string => Boolean(x)))],
        difficulties: [...new Set(recipes.map((r) => r.difficulty).filter((x): x is string => Boolean(x)))],
      };
    }

    return NextResponse.json(filters);
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
} 