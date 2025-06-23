import React from "react";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/sanityApi";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Article } from "@/types";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article: Article | null = await getArticleBySlug(params.slug);
  if (!article) return notFound();
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        {article.mainImage?.asset?.url && (
          <Image
            src={article.mainImage.asset.url}
            alt={article.mainImage.alt || article.title}
            width={800}
            height={400}
            className="mb-4 rounded-xl"
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <div className="text-3xl font-bold text-charcoal mb-2">{article.title}</div>
        <div className="text-md text-charcoal/70 mb-4">{article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}</div>
      </div>
      <article className="prose prose-lg text-charcoal bg-white rounded-2xl shadow-md p-6">
        <PortableText value={article.body} />
      </article>
      <div className="mt-8 flex justify-end">
        <button className="px-5 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition">Ask Vivi</button>
      </div>
    </main>
  );
} 