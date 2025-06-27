import Hero from "./components/layout/Hero";
import ArticleCard from "./components/content/ArticleCard";
import RecipeCard from "./components/content/RecipeCard";
import ProductCard from "./components/content/ProductCard";
import CardsSection from "./components/layout/CardsSection";
import BubbleChat from "./components/chat";
import { getArticles, getRecipes, getProducts } from "@/lib/sanityApi";
import { Article, Recipe, Product } from "@/types";
import Image from "next/image";
import InspireHero from "./components/layout/InspireHero";


export const revalidate = 3600;

export default async function HomePage() {
  const articles = await getArticles();
  const recipes = await getRecipes();
  const products = await getProducts();
  return (
    <main>
      <Hero />
      <div className="relative">
      <Image
          src="/bg2.jpg"
          alt="Background"
          fill
          className="object-cover object-center opacity-10 blur-lg pointer-events-none select-none z-0"
          priority={false}
        />
        <div className="relative z-10">
          <CardsSection
            title="Featured Products"
            items={products.map((p: Product) => ({ ...p, image: p.cardImage?.asset?.url, category: p.category || 'Uncategorized' }))}
            CardComponent={ProductCard}
            showMoreHref="/products"
            showMoreText="See Full Catalog"
          />
          <InspireHero id="hero-inspire-1" />
          <CardsSection
            title="Featured Recipes"
            items={recipes.map((r: Recipe) => ({ ...r, image: r.cardImage?.asset?.url, category: r.category || 'Uncategorized' }))}
            CardComponent={RecipeCard}
            showMoreHref="/recipes"
            showMoreText="Explore Recipes"
          />
           <InspireHero id="hero-inspire-2" reverse={true} />
          <CardsSection
            title="Latest Articles"
            items={articles.map((a: Article) => ({ ...a, image: a.cardImage?.asset?.url, category: a.category || 'Uncategorized' }))}
            CardComponent={ArticleCard}
            showMoreHref="/articles"
            showMoreText="Read More"
          />
        </div>
      </div>
      <BubbleChat />
    </main>
  );
}
