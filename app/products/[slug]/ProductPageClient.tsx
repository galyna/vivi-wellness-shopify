"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductPageClient({ product, gallery }: { product: { title: string; mainImage?: { asset?: { url?: string } }; galleryImages?: { asset?: { url?: string } }[]; category?: string; price: number; description?: string; color?: string; size?: string; material?: string }, gallery: string[] }) {
  const [mainImg, setMainImg] = useState(gallery[0]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      {/* Галерея */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center mb-4">
          <Image src={mainImg} alt={product.title} width={600} height={450} 
          sizes="(max-width: 768px) 100vw, 50vw" className="object-contain w-full h-full" />
        </div>
        <div className="flex gap-2 mt-2">
          {gallery.map((img: string) => (
            <button key={img} onClick={() => setMainImg(img)} className={`w-20 h-16 rounded-xl overflow-hidden border ${mainImg === img ? "border-coral" : "border-gray-200"}`}>
              <Image src={img} alt="thumb" width={80} height={64} sizes="80px" className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      </div>
      {/* Инфо */}
      <div className="flex-1 max-w-lg mx-auto flex flex-col">
        <div className="mb-2 text-sm text-gray-500">{product.category}</div>
        <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold">${product.price}</span>
          {/* Рейтинг и звёзды */}
          <span className="ml-4 text-yellow-500 font-bold">★ 4.6/5</span>
        </div>
        <div className="mb-4 text-gray-700">{product.description}</div>
        
        {/* Характеристики товара */}
        <div className="mb-6 space-y-3">
          {product.color && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Цвет:</span>
              <span className="text-sm">{product.color}</span>
            </div>
          )}
          {product.size && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Размер:</span>
              <span className="text-sm">{product.size}</span>
            </div>
          )}
          {product.material && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Материал:</span>
              <span className="text-sm">{product.material}</span>
            </div>
          )}
        </div>
        
        <button className="w-full py-3 rounded-full bg-black text-white font-bold text-lg mt-4 hover:bg-coral transition">
          Add to basket
        </button>
      </div>
    </main>
  );
} 