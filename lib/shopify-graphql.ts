import { GraphQLClient } from 'graphql-request';

const shopifyGraphQL = new GraphQLClient(
  `https://${process.env.SHOPIFY_SHOP_NAME}/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
    },
  }
);

// GraphQL queries
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      productType
      tags
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
            }
            compareAtPrice {
              amount
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export const PRODUCT_TYPES_QUERY = `
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

export const PRODUCT_TAGS_QUERY = `
  query GetProductTags($first: Int!) {
    products(first: $first) {
      edges {
        node {
          tags
        }
      }
    }
  }
`;

export const HOMEPAGE_PRODUCTS_QUERY = `
  query GetHomepageProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getHomepageProducts(limit: number = 2) {
  if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront configuration missing');
  }

  try {
    const data = await shopifyGraphQL.request(HOMEPAGE_PRODUCTS_QUERY, { first: limit }) as {
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            description: string;
            handle: string;
            productType: string;
            images: { edges: { node: { url: string; altText?: string } }[] };
            variants: { edges: { node: { price?: { amount: string } } }[] };
          }
        }[];
      }
    };

    return data.products.edges.map((edge) => {
      const product = edge.node;
      const firstVariant = product.variants.edges[0]?.node;
      
      return {
        _id: product.id.split('/').pop(),
        title: product.title,
        description: product.description,
        price: parseFloat(firstVariant?.price?.amount || '0'),
        images: product.images.edges.map((imgEdge) => imgEdge.node.url),
        category: product.productType,
        slug: product.handle,
        type: "product" as const,
      };
    });
  } catch (error) {
    console.error('Error fetching homepage products from Shopify:', error);
    return [];
  }
}

export async function getProductsByHandles(handles: string[]) {
  if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront configuration missing');
  }

  if (!handles || handles.length === 0) {
    return [];
  }

  try {
    // Build the query string manually since GraphQL variables don't work well with dynamic query strings
    const queryString = handles.map(handle => `handle:${handle}`).join(' OR ');
    
    const data = await shopifyGraphQL.request(`
      query GetProductsByHandles($first: Int!, $query: String!) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              description
              handle
              productType
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `, { 
      first: handles.length,
      query: queryString
    }) as {
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            description: string;
            handle: string;
            productType: string;
            images: { edges: { node: { url: string; altText?: string } }[] };
            variants: { edges: { node: { price?: { amount: string } } }[] };
          }
        }[];
      }
    };

    return data.products.edges.map((edge) => {
      const product = edge.node;
      const firstVariant = product.variants.edges[0]?.node;
      
      return {
        _id: product.id.split('/').pop(),
        title: product.title,
        description: product.description,
        price: parseFloat(firstVariant?.price?.amount || '0'),
        images: product.images.edges.map((imgEdge) => imgEdge.node.url),
        category: product.productType,
        slug: product.handle,
        type: "product" as const,
      };
    });
  } catch (error) {
    console.error('Error fetching products by handles from Shopify:', error);
    return [];
  }
}

export async function getProductsByIds(ids: string[], limit: number = 2) {
  if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront configuration missing');
  }

  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    // Since we can't directly query by Sanity IDs, we'll get recent products
    // In a real scenario, you'd need to map Sanity IDs to Shopify handles
    const data = await shopifyGraphQL.request(`
      query GetProductsByIds($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              title
              description
              handle
              productType
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `, { 
      first: limit
    }) as {
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            description: string;
            handle: string;
            productType: string;
            images: { edges: { node: { url: string; altText?: string } }[] };
            variants: { edges: { node: { price?: { amount: string } } }[] };
          }
        }[];
      }
    };

    return data.products.edges.map((edge) => {
      const product = edge.node;
      const firstVariant = product.variants.edges[0]?.node;
      
      return {
        _id: product.id.split('/').pop(),
        title: product.title,
        description: product.description,
        price: parseFloat(firstVariant?.price?.amount || '0'),
        images: product.images.edges.map((imgEdge) => imgEdge.node.url),
        category: product.productType,
        slug: product.handle,
        type: "product" as const,
      };
    });
  } catch (error) {
    console.error('Error fetching products by IDs from Shopify:', error);
    return [];
  }
}

export async function getProductByHandle(handle: string) {
  if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront configuration missing');
  }

  try {
    const data = await shopifyGraphQL.request(PRODUCT_QUERY, { handle }) as {
      product: {
        id: string;
        title: string;
        description: string;
        handle: string;
        productType: string;
        tags: string[];
        images: { edges: { node: { url: string; altText?: string } }[] };
        variants: { edges: { node: { id: string; title: string; price?: { amount: string }; compareAtPrice?: { amount: string }; availableForSale: boolean; selectedOptions: { name: string; value: string }[] } }[] };
        options: { name: string; values: string[] }[];
      }
    };

    if (!data.product) {
      return null;
    }

    const product = data.product;
    const firstVariant = product.variants.edges[0]?.node;
    
    return {
      _id: product.id.split('/').pop() || product.handle,
      title: product.title,
      description: product.description,
      price: parseFloat(firstVariant?.price?.amount || '0'),
      compareAtPrice: firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : undefined,
      images: product.images.edges.map((imgEdge) => imgEdge.node.url),
      category: product.productType,
      slug: product.handle,
      tags: product.tags,
      variants: product.variants.edges.map(edge => edge.node),
      options: product.options,
      type: "product" as const,
    };
  } catch (error) {
    console.error('Error fetching product by handle from Shopify:', error);
    return null;
  }
}

export default shopifyGraphQL; 