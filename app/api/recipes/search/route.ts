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
    
    query += `] | order(title ${sort}) {
      _id,
      title,
      description,
      category,
      time,
      difficulty,
      mainImage {
        asset->{url},
        alt
      },
      "slug": slug.current
    }`;

    const recipes = await client.fetch(query);
    
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
} 