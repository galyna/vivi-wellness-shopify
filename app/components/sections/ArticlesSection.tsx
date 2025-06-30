import CardsSection from "../content/CardsSection";
import { getArticles } from "@/lib/sanityApi";
import { Article } from "@/types";

export default async function ArticlesSection() {
  const articles = await getArticles(3);
  return (
    <CardsSection
      title="Latest Articles"
      items={articles.map((a: Article) => ({ ...a, type: "article" as const }))}
      showMoreHref="/articles"
      showMoreText="Read More"
    />
  );
}
