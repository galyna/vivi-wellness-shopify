import Hero from "./components/layout/Hero";
import ArticleCard from "./components/content/ArticleCard";
import RecipeCard from "./components/content/RecipeCard";
import ProductCard from "./components/content/ProductCard";
import CardsSection from "./components/content/CardsSection";
import BubbleChat from "./components/chat";
import { getArticles, getRecipes, getProducts } from "@/lib/sanityApi";
import { Article, Recipe, Product } from "@/types";

export const revalidate = 3600;

export default async function HomePage() {
  const articles = await getArticles();
  const recipes = await getRecipes();
  const products = await getProducts();
  return (
    <main>
      <Hero />
      <CardsSection
        title="Featured Products"
        items={products.map((p: Product) => ({
          ...p,
          image: p.cardImage?.asset?.url,
        }))}
        CardComponent={ProductCard}
        showMoreHref="/products"
        showMoreText="Show More"
      />
      <CardsSection
        title="Featured Recipes"
        items={recipes.map((r: Recipe) => ({
          ...r,
          image: r.cardImage?.asset?.url,
        }))}
        CardComponent={RecipeCard}
        showMoreHref="/recipes"
        showMoreText="Show More"
      />
      <CardsSection
        title="Latest Articles"
        items={articles.map((a: Article) => ({
          ...a,
          image: a.cardImage?.asset?.url,
        }))}
        CardComponent={ArticleCard}
        showMoreHref="/articles"
        showMoreText="Show More"
      />

      <BubbleChat />
    </main>
  );
}
