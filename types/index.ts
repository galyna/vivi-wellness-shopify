import { PortableTextBlock } from "@portabletext/types";


export interface Product {
  _id: string;
  title: string;
  slug: string;
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
  description: string;
  category: string;
  price: number;
  articlesIds?: string[];
  recipesIds?: string[];
  galleryImagePrompts?: string[];
  mainImagePrompt?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  body: (PortableTextBlock | { asset?: { url: string }; alt?: string; prompt?: string })[];
  intro?: string;
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
  category?: string;
  productsIds?: string[];
  recipesIds?: string[];
  publishedAt?: string;
  length?: string;
  tone?: string;
  author?: string;
  galleryImagePrompts?: string[];
  mainImagePrompt?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  mainImagePrompt?: string;
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
  stepImagePrompts?: string[];
  steps: (PortableTextBlock | { asset?: { url: string }; alt?: string; prompt?: string })[];
  time?: string;
  difficulty?: string;
  servings?: number;
  ingredients: string[];
  category?: string;
  productsIds?: string[];
  articlesIds?: string[];
} 