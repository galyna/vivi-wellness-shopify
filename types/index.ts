import { PortableTextBlock } from "@portabletext/types";


export interface Product {
  _id: string;
  title: string;
  slug: string;
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
  cardImage?: {
    asset?: { url: string };
    alt?: string;
  };
  description: string;
  category: string;
  price: number;
  articlesIds?: string[];
  recipesIds?: string[];
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
  cardImage?: {
    asset?: { url: string };
    alt?: string;
  };
  body: (PortableTextBlock | { asset?: { url: string }; alt?: string })[];
  category?: string;
  productsIds?: string[];
  recipesIds?: string[];
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  duration?: string;
  difficulty?: string;
  servings?: number;
  ingredients: string[];
  steps: PortableTextBlock[];
  category?: string;
  productsIds?: string[];
  articlesIds?: string[];
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
  cardImage?: {
    asset?: { url: string };
    alt?: string;
  };
} 