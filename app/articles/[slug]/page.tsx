import React from "react";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/sanityApi";
import { PortableText } from "@portabletext/react";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
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