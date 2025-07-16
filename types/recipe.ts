export interface RecipeStep {
  text?: string;
  image?: {
    asset?: { url: string };
    alt?: string;
  };
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
  stepsWithContent?: RecipeStep[];
  steps?: string[];
  time?: string;
  difficulty?: string;
  servings?: number;
  ingredients: string[];
  category?: string;
  productsIds?: string[];
  articlesIds?: string[];
  shopifyProductHandles?: string[];
}

export default Recipe; 