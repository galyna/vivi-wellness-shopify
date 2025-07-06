import React from "react";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/sanityApi";
import { PortableText } from "@portabletext/react";
import { Article } from "@/types";
import Image from "next/image";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article: Article | null = await getArticleBySlug(slug);
  if (!article) return notFound();

  return (
    <main className="max-w-7xl mx-auto  px-8 py-8 lg:px-16">
      <section className="w-full flex flex-col md:flex-row items-stretch justify-between bg-[#222] rounded-3xl mb-10 shadow-lg overflow-hidden">
        {/* Image block — сверху на мобиле, справа на десктопе */}
        <div className="w-full md:w-1/2 h-48 md:h-auto aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0 relative">
          {article.mainImage?.asset?.url && (
            <Image
              src={article.mainImage.asset.url}
              alt={article.mainImage.alt || article.title}
              fill
              className="object-cover w-full h-full"
              priority
            />
          )}
        </div>
        {/* Text block */}
        <div className="flex-1 flex flex-col justify-center items-start text-white p-6 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {article.title}
          </h1>
          {article.intro && <p className="text-lg mb-6">{article.intro}</p>}
          <div className="text-sm text-white/70 mb-4">
            {article.author && <span>By {article.author}</span>}
            {article.author && article.date && <span className="mx-2">|</span>}
            {article.date && (
              <span>{new Date(article.date).toLocaleDateString()}</span>
            )}
          </div>
          <div className="mt-8 flex justify-end">
            <button className="px-5 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition">
              Ask Vivi
            </button>
          </div>
        </div>
      </section>

      {/* Параграфы */}
      {article.paragraphs?.map((p, i) => {
        const isEven = i % 2 === 0;
        return (
          <div
            key={i}
            className={`flex flex-col md:flex-row ${
              !isEven ? "md:flex-row-reverse" : ""
            } items-center gap-8 md:gap-16 mb-16`}
          >
            {p.image?.asset?.url && (
              <Image
                src={p.image.asset.url}
                alt={p.image.alt || p.title || "Article image"}
                width={400}
                height={324}
                className="w-full md:w-1/2 h-full object-cover rounded-xl shadow-md mb-4 md:mb-0"
              />
            )}
            <div className="flex-1 text-left">
              {p.title && (
                <h2 className="text-4xl font-semibold mb-4 text-charcoal">
                  {p.title}
                </h2>
              )}
              {p.body && (
                <div className="text-xl leading-relaxed text-gray-800 space-y-6s">
                  {/* Строки */}
                  {Array.isArray(p.body) &&
                    p.body
                      .filter((x) => typeof x === "string")
                      .map((str, idx) => <p key={"str-" + idx}>{str}</p>)}
                  {/* PortableText-блоки */}
                  {Array.isArray(p.body) &&
                    p.body.some((x) => typeof x === "object") && (
                      <PortableText
                        value={p.body.filter((x) => typeof x === "object")}
                      />
                    )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </main>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles: Article[] = await getArticles();
  return articles.map((article: Article) => ({ slug: article.slug }));
}
