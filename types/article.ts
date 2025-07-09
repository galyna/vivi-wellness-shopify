import { PortableTextBlock } from '@portabletext/types';

export interface ArticleParagraph {
  title?: string;
  body: (PortableTextBlock | string )[];
  image?: {
    asset?: { url: string };
    alt?: string;
  };
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
  length?: string;
  tone?: string;
  author?: string;
  date?: string;
  paragraphs?: ArticleParagraph[];
  category?: string;
  productsIds?: string[];
  recipesIds?: string[];
}

export default Article; 