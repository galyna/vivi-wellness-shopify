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
  galleryImages?: { asset?: { url: string } }[];
  color?: string;
  size?: string;
  material?: string;
  description: string;
  category: string;
  price: number;
  articlesIds?: string[];
  recipesIds?: string[];
}

export default Product; 