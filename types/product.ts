export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
  image: ShopifyImage | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price?: { amount: string };
  compareAtPrice?: { amount: string };
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
}

export interface ShopifyOption {
  name: string;
  values: string[];
}

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  admin_graphql_api_id: string;
}

// Legacy Sanity types for backward compatibility
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  slug: string;
  tags?: string[];
  variants?: ShopifyVariant[];
  options?: ShopifyOption[];
  type?: "product";
} 