import { NextResponse } from "next/server";
import shopifyGraphQL from '@/lib/shopify-graphql';

// Efficient queries for getting filter values
const PRODUCT_TYPES_QUERY = `
  query GetProductTypes($first: Int!) {
    products(first: $first) {
      edges {
        node {
          productType
        }
      }
    }
  }
`;



const PRODUCT_OPTIONS_QUERY = `
  query GetProductOptions($first: Int!) {
    products(first: $first) {
      edges {
        node {
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRICE_RANGE_QUERY = `
  query GetPriceRange($first: Int!) {
    products(first: $first) {
      edges {
        node {
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
`;

interface ShopifyFilterResponse {
  categories: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export async function GET() {
  try {
    // 1. Get product types (categories) - efficient
    const typesData = await shopifyGraphQL.request(PRODUCT_TYPES_QUERY, { first: 250 }) as {
      products: { edges: { node: { productType: string } }[] }
    };
    
    const categories = [...new Set(
      typesData.products.edges
        .map(edge => edge.node.productType)
        .filter(Boolean)
    )].sort();

    // 2. Get product options (size, color, material) - more efficient than full products
    const optionsData = await shopifyGraphQL.request(PRODUCT_OPTIONS_QUERY, { first: 250 }) as {
      products: { edges: { node: { options: { name: string; values: string[] }[] } }[] }
    };

    const allColors = new Set<string>();
    const allSizes = new Set<string>();
    const allMaterials = new Set<string>();

    optionsData.products.edges.forEach(edge => {
      edge.node.options?.forEach(option => {
        const optionName = option.name.toLowerCase();
        const values = option.values.map(v => v.toLowerCase());
        
        if (optionName.includes('color') || optionName.includes('colour')) {
          values.forEach(value => allColors.add(value));
        } else if (optionName.includes('size')) {
          values.forEach(value => allSizes.add(value));
        } else if (optionName.includes('material')) {
          values.forEach(value => allMaterials.add(value));
        }
      });
    });

    // 3. Get price range - efficient
    const priceData = await shopifyGraphQL.request(PRICE_RANGE_QUERY, { first: 250 }) as {
      products: { 
        edges: { 
          node: { 
            priceRange: { 
              minVariantPrice: { amount: string };
              maxVariantPrice: { amount: string };
            } 
          } 
        }[] 
      }
    };

    const allPrices: number[] = [];
    priceData.products.edges.forEach(edge => {
      const { minVariantPrice, maxVariantPrice } = edge.node.priceRange;
      if (minVariantPrice?.amount) allPrices.push(parseFloat(minVariantPrice.amount));
      if (maxVariantPrice?.amount) allPrices.push(parseFloat(maxVariantPrice.amount));
    });

    const priceRange = allPrices.length > 0 
      ? { min: Math.min(...allPrices), max: Math.max(...allPrices) }
      : { min: 0, max: 1000 };

    const filters: ShopifyFilterResponse = {
      categories,
      colors: Array.from(allColors).sort(),
      sizes: Array.from(allSizes).sort(),
      materials: Array.from(allMaterials).sort(),
      priceRange,
    };

    return NextResponse.json(filters);
  } catch (error) {
    console.error("Error fetching Shopify filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify filters" },
      { status: 500 }
    );
  }
} 