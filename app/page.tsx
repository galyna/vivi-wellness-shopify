import Hero from "./components/layout/Hero";
import BubbleChat from "./components/chat";
import { Suspense } from "react";
import ProductsSection from "./components/sections/ProductsSection";
import RecipesSection from "./components/sections/RecipesSection";
import ArticlesSection from "./components/sections/ArticlesSection";
import InspireHero from "./components/layout/InspireHero";

function SkeletonSection({ title }: { title: string }) {
  return <div className="min-h-[300px] flex items-center justify-center text-gray-400">{title} loading...</div>;
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="relative">
        <div className="relative z-10">
          <Suspense fallback={<SkeletonSection title="Products" />}>
            <ProductsSection />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Inspire" />}>
            <InspireHero id="hero-inspire-1" />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Articles" />}>
            <ArticlesSection />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Inspire" />}>
            <InspireHero id="hero-inspire-2"  />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Recipes" />}>
            <RecipesSection />
          </Suspense> 
        </div>
      </div>
      <BubbleChat />
    </main>
  );
}
