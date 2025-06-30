import React from "react";
import { getProductBySlug } from "@/lib/sanityApi";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const gallery: string[] = [
    product.mainImage?.asset?.url,
    ...(product.galleryImages?.map((img: { asset?: { url?: string } }) => img.asset?.url) || []),
    "/placeholder.jpg"
  ].filter(Boolean) as string[];
  return <ProductPageClient product={product} gallery={gallery} />;
} 