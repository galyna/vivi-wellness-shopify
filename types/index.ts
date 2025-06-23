import { PortableTextBlock } from "@portabletext/types";

export interface Tip {
  _id: string;
  text: string;
  icon?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  body: PortableTextBlock[];
  mainImage?: {
    asset?: { url: string };
    alt?: string;
  };
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  ingredients: string[];
  steps: PortableTextBlock[];
} 