import Hero from "./components/layout/Hero";
import TodayPickCard from "./components/content/TodayPickCard";
import ArticleCard from "./components/content/ArticleCard";
import RecipeCard from "./components/content/RecipeCard";
import BubbleChat from "./components/chat";
import { getTips, getArticles, getRecipes } from "@/lib/sanityApi";
import { Tip, Article, Recipe } from "@/types";

export const revalidate = 3600;

export default async function HomePage() {
  const tips = await getTips();
  const articles = await getArticles();
  const recipes = await getRecipes();
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Hero />
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">Today&apos;s Picks</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {tips.map((tip: Tip) => (
            <TodayPickCard
              key={tip._id}
              title={tip.text}
              description={"Try this today!"}
              category={"tip"}
              image={tip.icon}
            />
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">Latest Articles</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {articles.slice(0, 3).map((article: Article) => (
            <ArticleCard
              key={article._id}
              slug={article.slug}
              title={article.title}
              description={typeof article.body === 'string' ? article.body : 'Read more...'}
              category={"Wellness"}
            />
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">Featured Recipes</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {recipes.slice(0, 3).map((recipe: Recipe) => (
            <RecipeCard
              key={recipe._id}
              slug={recipe.slug}
              title={recipe.title}
              ingredients={recipe.ingredients}
              category={"Recipe"}
            />
          ))}
        </div>
      </section>
      <BubbleChat />
    </main>
  );
}
