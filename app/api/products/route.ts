import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/sanity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categories = searchParams.get("categories")?.split(",") || [];
    const colors = searchParams.get("colors")?.split(",") || [];
    const sizes = searchParams.get("sizes")?.split(",") || [];
    const materials = searchParams.get("materials")?.split(",") || [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const offset = (page - 1) * limit;

    // Build Sanity query with filters
    let query = `*[_type == "product"`;
    
    const conditions = [];
    
    if (search) {
      conditions.push(`title match "*${search}*"`);
    }
    
    if (categories.length > 0) {
      conditions.push(`category in [${categories.map(cat => `"${cat}"`).join(",")}]`);
    }
    
    if (colors.length > 0) {
      conditions.push(`color in [${colors.map(color => `"${color}"`).join(",")}]`);
    }
    
    if (sizes.length > 0) {
      conditions.push(`size in [${sizes.map(size => `"${size}"`).join(",")}]`);
    }
    
    if (materials.length > 0) {
      conditions.push(`material in [${materials.map(material => `"${material}"`).join(",")}]`);
    }
    
    if (minPrice) {
      conditions.push(`price >= ${minPrice}`);
    }
    
    if (maxPrice) {
      conditions.push(`price <= ${maxPrice}`);
    }
    
    if (conditions.length > 0) {
      query += ` && (${conditions.join(" && ")})`;
    }
    
    query += `] | order(title ${sort}) [${offset}...${offset + limit}] {
      _id,
      title,
      description,
      price,
      category,
      color,
      size,
      material,
      mainImage {
        asset->{url},
        alt
      },
      cardImage {
        asset->{url},
        alt
      },
      "slug": slug.current
    }`;

    // Get total count for pagination with filters
    let countQuery = `*[_type == "product"`;
    
    if (conditions.length > 0) {
      countQuery += ` && (${conditions.join(" && ")})`;
    }
    
    countQuery += `]`;
    const totalCount = await client.fetch(`count(${countQuery})`);

    const products = await client.fetch(query);
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: offset + limit < totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
} 