import { getProducts } from "@/lib/sanityApi";
import { notFound } from "next/navigation";
import { Product } from "@/types";
import Image from "next/image";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const products: Product[] = await getProducts();
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6 flex flex-col items-center">
        {product.mainImage?.asset?.url && (
          <Image
            src={product.mainImage.asset.url}
            alt={product.mainImage.alt || product.title}
            width={400}
            height={400}
            className="mb-4 rounded-xl"
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <div className="text-3xl font-bold text-charcoal mb-2">{product.title}</div>
        <div className="text-xs px-3 py-1 rounded-full bg-lemon text-charcoal font-accent mb-2">{product.category}</div>
        <div className="text-2xl text-coral font-bold mb-2">${product.price}</div>
        <div className="text-md text-charcoal/70 text-center mb-4">{product.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.articlesIds && product.articlesIds.length > 0 && <span className="text-xs bg-coral/20 text-coral px-2 py-1 rounded-full">Articles: {product.articlesIds.length}</span>}
          {product.recipesIds && product.recipesIds.length > 0 && <span className="text-xs bg-mint/40 text-charcoal px-2 py-1 rounded-full">Recipes: {product.recipesIds.length}</span>}
        </div>
      </div>
    </main>
  );
} 