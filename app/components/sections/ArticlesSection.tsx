import CardsSection from "./CardsSection";
import { getArticles } from "@/lib/sanityApi";
import { Article } from "@/types";

export default async function ArticlesSection() {
  const articles = await getArticles(2);
  return (
    <section className="mb-4 max-w-7xl mx-auto relative">
      <div className="px-8 lg:px-16 py-12 lg:py-16">
        <CardsSection
          title="Latest Articles"
          items={articles.map((a: Article) => ({
            ...a,
            type: "article" as const,
          }))}
          showMoreHref="/articles"
          showMoreText="Read More"
        />
      </div>
    </section>
  );
}
