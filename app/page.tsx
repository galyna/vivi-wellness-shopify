import Hero from "./components/layout/Hero";
import BubbleChat from "./components/chat";
import Image from "next/image";
import { Suspense } from "react";
import ProductsSection from "./components/sections/ProductsSection";
import RecipesSection from "./components/sections/RecipesSection";
import ArticlesSection from "./components/sections/ArticlesSection";
import InspireHero from "./components/content/InspireHero";

function SkeletonSection({ title }: { title: string }) {
  return <div className="min-h-[300px] flex items-center justify-center text-gray-400">{title} loading...</div>;
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="relative">
        <Image
          src="/bg2.jpg"
          alt="Background"
          fill
          className="object-cover object-center opacity-15 blur-lg pointer-events-none select-none z-0"
          priority={false}
        />
        <div className="relative z-10">
          <Suspense fallback={<SkeletonSection title="Products" />}>
            <ProductsSection />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Inspire" />}>
            <InspireHero id="hero-inspire-1" />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Recipes" />}>
            <RecipesSection />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Inspire" />}>
            <InspireHero id="hero-inspire-2" reverse />
          </Suspense>
          <Suspense fallback={<SkeletonSection title="Articles" />}>
            <ArticlesSection />
          </Suspense>
        </div>
      </div>
      <BubbleChat />
    </main>
  );
}
