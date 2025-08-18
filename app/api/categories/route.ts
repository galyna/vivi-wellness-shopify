import { NextResponse } from 'next/server';
import shopifyGraphQL, { PRODUCT_TYPES_QUERY, PRODUCT_TAGS_QUERY } from '@/lib/shopify-graphql';

export async function GET() {
  try {
    // Check environment variables
    if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json(
        { error: 'Shopify Storefront configuration missing' },
        { status: 500 }
      );
    }

    try {
      // Get product types (categories)
      const typesData = await shopifyGraphQL.request(PRODUCT_TYPES_QUERY, { first: 250 }) as { products: { edges: { node: { productType: string } }[] } };
      const productTypes = typesData.products.edges
        .map((edge) => edge.node.productType)
        .filter((type: string) => type && type.trim() !== '')
        .filter((type: string, index: number, arr: string[]) => arr.indexOf(type) === index); // Remove duplicates

      // Get product tags
      const tagsData = await shopifyGraphQL.request(PRODUCT_TAGS_QUERY, { first: 250 }) as { products: { edges: { node: { tags: string[] } }[] } };
      const allTags = tagsData.products.edges
        .flatMap((edge) => edge.node.tags || [])
        .filter((tag: string) => tag && tag.trim() !== '')
        .filter((tag: string, index: number, arr: string[]) => arr.indexOf(tag) === index); // Remove duplicates

      return NextResponse.json({
        categories: productTypes,
        tags: allTags,
        source: 'shopify'
      });

    } catch {
      // Fallback to mock categories
      return NextResponse.json({
        categories: ['Wellness', 'Beauty', 'Home', 'Gifts'],
        tags: ['organic', 'natural', 'vegan', 'cruelty-free', 'sustainable'],
        source: 'mock'
      });
    }

  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 