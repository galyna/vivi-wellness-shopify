import { NextResponse } from 'next/server';
import shopifyGraphQL, { PRODUCT_TYPES_QUERY, PRODUCT_TAGS_QUERY } from '@/lib/shopify-graphql';

export async function GET() {
  try {
    // Check environment variables
    if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
      console.error('Missing Shopify Storefront environment variables');
      return NextResponse.json(
        { error: 'Shopify Storefront configuration missing' },
        { status: 500 }
      );
    }

    console.log('Fetching categories from Shopify Storefront...');

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

      console.log('Categories fetched successfully:', {
        productTypes: productTypes.length,
        tags: allTags.length
      });

      return NextResponse.json({
        categories: productTypes,
        tags: allTags,
        source: 'shopify'
      });

    } catch (shopifyError) {
      console.error('Shopify Storefront API error:', {
        message: String(shopifyError),
        code: 'SHOPIFY_ERROR',
      });
      // Fallback to mock categories
      console.log('Falling back to mock categories...');
      return NextResponse.json({
        categories: ['Wellness', 'Beauty', 'Home', 'Gifts'],
        tags: ['organic', 'natural', 'vegan', 'cruelty-free', 'sustainable'],
        source: 'mock'
      });
    }

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 