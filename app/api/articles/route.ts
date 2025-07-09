import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/sanity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categories = searchParams.get("categories")?.split(",") || [];
    const lengths = searchParams.get("lengths")?.split(",") || [];
    const tones = searchParams.get("tones")?.split(",") || [];
    const authors = searchParams.get("authors")?.split(",") || [];
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sort = searchParams.get("sort") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const offset = (page - 1) * limit;

    // Build Sanity query with filters
    let query = `*[_type == "article"`;
    
    const conditions = [];
    
    if (search) {
      conditions.push(`title match "*${search}*"`);
    }
    
    if (categories.length > 0) {
      conditions.push(`category in [${categories.map(cat => `"${cat}"`).join(",")}]`);
    }
    
    if (lengths.length > 0) {
      conditions.push(`length in [${lengths.map(length => `"${length}"`).join(",")}]`);
    }
    
    if (tones.length > 0) {
      conditions.push(`tone in [${tones.map(tone => `"${tone}"`).join(",")}]`);
    }
    
    if (authors.length > 0) {
      conditions.push(`author in [${authors.map(author => `"${author}"`).join(",")}]`);
    }
    
    if (dateFrom) {
      conditions.push(`date >= "${dateFrom}"`);
    }
    
    if (dateTo) {
      conditions.push(`date <= "${dateTo}"`);
    }
    
    if (conditions.length > 0) {
      query += ` && (${conditions.join(" && ")})`;
    }
    
    query += `] | order(title ${sort}) [${offset}...${offset + limit}] {
      _id,
      title,
      description,
      category,
      length,
      tone,
      author,
      date,
      mainImage {
        asset->{url},
        alt
      },
      "slug": slug.current
    }`;

    // Get total count for pagination with filters
    let countQuery = `*[_type == "article"`;
    
    if (conditions.length > 0) {
      countQuery += ` && (${conditions.join(" && ")})`;
    }
    
    countQuery += `]`;
    const totalCount = await client.fetch(`count(${countQuery})`);

    const articles = await client.fetch(query);
    
    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: offset + limit < totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
} 