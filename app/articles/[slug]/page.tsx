import React from "react";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/sanityApi";
import { PortableText } from "@portabletext/react";
import { Article } from "@/types";
import imageUrlBuilder from '@sanity/image-url'
import Image from 'next/image'
import { client } from '@/lib/sanityApi'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article: Article | null = await getArticleBySlug(slug);
  if (!article) return notFound();
  const urlFor = (src: SanityImageSource) => imageUrlBuilder(client).image(src)
  function isBlock(block: unknown): block is import("@portabletext/types").PortableTextBlock {
    return typeof block === 'object' && block !== null && '_type' in block && (block as { _type?: string })._type === 'block';
  }
  // Оставляем только блоки текста для PortableText
  const body = article.body as (import("@portabletext/types").PortableTextBlock | { asset?: { url: string }; alt?: string })[];
  const bodyBlocks = Array.isArray(body)
    ? body.filter(isBlock)
    : [];
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        {article.mainImage && (
          <Image
            src={urlFor(article.mainImage).width(800).height(400).auto('format').url()}
            alt={article.mainImage.alt || article.title}
            width={800}
            height={400}
            className="mb-4 rounded-xl"
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <div className="text-3xl font-bold text-charcoal mb-2">{article.title}</div>
      </div>
      <article className="prose prose-lg text-charcoal bg-white rounded-2xl shadow-md p-6">
        <PortableText value={bodyBlocks} />
      </article>
      <div className="mt-8 flex justify-end">
        <button className="px-5 py-2 rounded-full bg-coral text-white font-bold shadow hover:bg-neon transition">Ask Vivi</button>
      </div>
      
    </main>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles: Article[] = await getArticles();
  return articles.map((article: Article) => ({ slug: article.slug }));
} 