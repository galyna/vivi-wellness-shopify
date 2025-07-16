import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/sanity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categories = searchParams.get("categories")?.split(",") || [];
    const times = searchParams.get("times")?.split(",") || [];
    const difficulties = searchParams.get("difficulties")?.split(",") || [];
    const sort = searchParams.get("sort") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const offset = (page - 1) * limit;

    // Map sort values to Sanity order syntax
    const getSortOrder = (sortValue: string) => {
      switch (sortValue) {
        case "title_asc":
          return "order(title asc)";
        case "title_desc":
          return "order(title desc)";
        default:
          return "order(title asc)";
      }
    };

    // Build Sanity query with filters
    let query = `*[_type == "recipe"`;
    
    const conditions = [];
    
    if (search) {
      conditions.push(`title match "*${search}*"`);
    }
    
    if (categories.length > 0) {
      conditions.push(`category in [${categories.map(cat => `"${cat}"`).join(",")}]`);
    }
    
    if (times.length > 0) {
      conditions.push(`time in [${times.map(time => `"${time}"`).join(",")}]`);
    }
    
    if (difficulties.length > 0) {
      conditions.push(`difficulty in [${difficulties.map(difficulty => `"${difficulty}"`).join(",")}]`);
    }
    
    if (conditions.length > 0) {
      query += ` && (${conditions.join(" && ")})`;
    }
    
    query += `] | ${getSortOrder(sort)} [${offset}...${offset + limit}] {
      _id,
      title,
      "description": intro,
      category,
      time,
      difficulty,
      mainImage {
        asset->{url},
        alt
      },
      "slug": slug.current
    }`;

    // Get total count for pagination with filters
    let countQuery = `*[_type == "recipe"`;
    
    if (conditions.length > 0) {
      countQuery += ` && (${conditions.join(" && ")})`;
    }
    
    countQuery += `]`;
    
    console.log("Sanity query:", query);
    
    const [recipes, totalCount] = await Promise.all([
      client.fetch(query),
      client.fetch(`count(${countQuery})`)
    ]);
    
    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: offset + limit < totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
} 