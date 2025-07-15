import { NextRequest, NextResponse } from 'next/server';
import shopifyGraphQL, { PRODUCTS_QUERY } from '@/lib/shopify-graphql';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
      console.error('Missing Shopify Storefront environment variables');
      return NextResponse.json(
        { error: 'Shopify Storefront configuration missing' },
        { status: 500 }
      );
    }

    console.log('Shopify Storefront config:', {
      shopName: process.env.SHOPIFY_SHOP_NAME,
      hasToken: !!process.env.SHOPIFY_STOREFRONT_TOKEN,
      graphqlUrl: `https://${process.env.SHOPIFY_SHOP_NAME}/api/2024-01/graphql.json`
    });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'asc';

    // Build query parameters
    const params: {
      limit: number;
      page: number;
      status: string;
      product_type?: string;
      title?: string;
    } = {
      limit,
      page,
      status: 'active'
    };

    if (category) {
      params.product_type = category;
    }

    if (search) {
      params.title = search;
    }

    console.log('Shopify API params:', params);

    // Try Shopify Storefront GraphQL first, fallback to mock data
    try {
      console.log('Attempting to fetch products from Shopify Storefront...');
      
      // Build GraphQL query variables
      const variables: {
        first: number;
        query?: string;
        sortKey?: string;
        reverse?: boolean;
      } = {
        first: limit
      };
      
      if (category) {
        variables.query = `product_type:${category}`;
      }
      
      if (search) {
        variables.query = variables.query ? `${variables.query} AND ${search}` : search;
      }

      // Add sorting
      if (sort === 'title_asc') {
        variables.sortKey = 'TITLE';
        variables.reverse = false;
      } else if (sort === 'title_desc') {
        variables.sortKey = 'TITLE';
        variables.reverse = true;
      } else if (sort === 'price_asc') {
        variables.sortKey = 'PRICE';
        variables.reverse = false;
      } else if (sort === 'price_desc') {
        variables.sortKey = 'PRICE';
        variables.reverse = true;
      } else if (sort === 'created_desc') {
        variables.sortKey = 'CREATED_AT';
        variables.reverse = true;
      } else if (sort === 'created_asc') {
        variables.sortKey = 'CREATED_AT';
        variables.reverse = false;
      } else {
        // Default sorting
        variables.sortKey = 'TITLE';
        variables.reverse = false;
      }
      
      console.log('GraphQL variables:', variables);
      
      const data = await shopifyGraphQL.request(PRODUCTS_QUERY, variables) as {
        products: {
          edges: {
            node: {
              id: string;
              title: string;
              description: string;
              handle: string;
              productType: string;
              images: { edges: { node: { url: string } }[] };
              variants: { edges: { node: { id: string; title: string; price?: { amount: string } } }[] };
              options?: { id: string; name: string; values: string[] }[];
            }
          }[];
          pageInfo: { hasNextPage: boolean }
        }
      };
      console.log(`Successfully fetched ${data.products.edges.length} products from Shopify`);

      // Transform GraphQL response to match your app's format
      const transformedProducts = data.products.edges.map((edge) => {
        const product = edge.node;
        
        // Безопасно получаем первый вариант с ценой
        const firstVariantWithPrice = product.variants.edges.find(
          (vEdge) => vEdge?.node?.price?.amount && parseFloat(vEdge.node.price.amount) > 0
        )?.node;
        
        // Fallback на первый доступный вариант
        const firstVariant = firstVariantWithPrice || product.variants.edges[0]?.node;
        
        return {
          _id: product.id.split('/').pop(),
          title: product.title,
          description: product.description,
          price: parseFloat(firstVariant?.price?.amount || '0'),
          images: product.images.edges.map((imgEdge) => imgEdge.node.url),
          category: product.productType,
          slug: product.handle,
          variants: product.variants.edges.map((vEdge) => vEdge.node),
          options: product.options || []
        };
      });

      const response = {
        products: transformedProducts,
        hasMore: data.products.pageInfo.hasNextPage,
        total: transformedProducts.length,
        source: 'shopify' // Добавляем метку источника
      };

      console.log('Returning Shopify data:', response);
      return NextResponse.json(response);
    } catch (shopifyError) {
      console.error('Shopify Storefront API error details:', {
        message: String(shopifyError),
        code: 'SHOPIFY_ERROR'
      });
      
      return NextResponse.json(
        { error: 'Failed to fetch products from Shopify' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 