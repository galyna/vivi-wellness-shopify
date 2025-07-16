import { NextRequest, NextResponse } from 'next/server';
import shopifyGraphQL, { PRODUCTS_QUERY } from '@/lib/shopify-graphql';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json(
        { error: 'Shopify Storefront configuration missing' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const after = searchParams.get('after');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'asc';
    
    // Variant-based filter parameters
    const colors = searchParams.get('colors')?.split(',').filter(Boolean);
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean);
    const materials = searchParams.get('materials')?.split(',').filter(Boolean);

    try {
      const variables: {
        first: number;
        after?: string;
        query?: string;
        sortKey?: string;
        reverse?: boolean;
      } = { first: limit };
      
      if (after) variables.after = after;
      
      // Build Shopify search query
      const queryParts: string[] = [];
      
      if (category) queryParts.push(`product_type:${category}`);
      if (search) {
        // Simple search without quotes
        queryParts.push(search);
      }
      
      // Add variant-based filtering
      if (colors?.length) {
        const colorQuery = colors.map(color => `variant_option:color:${color}`).join(' OR ');
        queryParts.push(`(${colorQuery})`);
      }
      
      if (sizes?.length) {
        const sizeQuery = sizes.map(size => `variant_option:size:${size}`).join(' OR ');
        queryParts.push(`(${sizeQuery})`);
      }
      
      if (materials?.length) {
        const materialQuery = materials.map(material => `variant_option:material:${material}`).join(' OR ');
        queryParts.push(`(${materialQuery})`);
      }
      
      if (queryParts.length) {
        variables.query = queryParts.join(' AND ');
      }

      // Add sorting
      const sortMap: Record<string, { sortKey: string; reverse: boolean }> = {
        'title_asc': { sortKey: 'TITLE', reverse: false },
        'title_desc': { sortKey: 'TITLE', reverse: true },
        'price_asc': { sortKey: 'PRICE', reverse: false },
        'price_desc': { sortKey: 'PRICE', reverse: true },
        'created_desc': { sortKey: 'CREATED_AT', reverse: true },
        'created_asc': { sortKey: 'CREATED_AT', reverse: false }
      };
      
      const sortConfig = sortMap[sort] || { sortKey: 'TITLE', reverse: false };
      variables.sortKey = sortConfig.sortKey;
      variables.reverse = sortConfig.reverse;
      
      const data = await shopifyGraphQL.request(PRODUCTS_QUERY, variables) as {
        products: {
          edges: {
            node: {
              id: string;
              title: string;
              description: string;
              handle: string;
              productType: string;
              tags: string[];
              images: { edges: { node: { url: string } }[] };
              variants: { edges: { node: { id: string; title: string; price?: { amount: string } } }[] };
              options?: { id: string; name: string; values: string[] }[];
            }
          }[];
          pageInfo: { 
            hasNextPage: boolean;
            endCursor: string;
          }
        }
      };

      const transformedProducts = data.products.edges.map((edge) => {
        const product = edge.node;
        
        // Get first variant with price
        const firstVariant = product.variants.edges.find(
          (vEdge) => vEdge?.node?.price?.amount && parseFloat(vEdge.node.price.amount) > 0
        )?.node || product.variants.edges[0]?.node;
        
        return {
          _id: product.id.split('/').pop(),
          title: product.title,
          description: product.description,
          price: parseFloat(firstVariant?.price?.amount || '0'),
          images: product.images.edges.map((imgEdge) => imgEdge.node.url),
          category: product.productType,
          slug: product.handle,
          tags: product.tags,
          variants: product.variants.edges.map((vEdge) => vEdge.node),
          options: product.options || []
        };
      });

      return NextResponse.json({
        products: transformedProducts,
        hasMore: data.products.pageInfo.hasNextPage,
        nextCursor: data.products.pageInfo.endCursor,
        total: transformedProducts.length,
        source: 'shopify'
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch products from Shopify' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 