"use client";
import { useCartStore } from "@/app/store/cartStore";
import { useEffect, useState } from "react";
// We'll fetch via Next.js API route to avoid CORS issues
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { lines, removeFromCart, updateQty, clearCart, checkoutUrl } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?limit=100");
        const data = await res.json();
        setProducts(data.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Найти продукт по variantId
  const getProduct = (variantId: string) =>
    (products ?? []).find(p => p.variants?.some(v => v.id === variantId));

  const total = (lines ?? []).reduce((sum, line) => {
    const prod = getProduct(line.merchandiseId);
    return sum + (prod ? prod.price * line.quantity : 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>
      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading…</div>
      ) : (lines ?? []).length === 0 ? (
        <div className="text-center text-gray-400 py-20">Your cart is empty. <Link href="/products" className="text-coral underline">Go to catalog</Link></div>
      ) : (
        <>
          <div className="flex flex-col gap-6 mb-8">
            {(lines ?? []).map(line => {
              const prod = getProduct(line.merchandiseId);
              if (!prod) return null;
              return (
                <div key={line.id} className="flex items-center gap-4 border-b pb-4">
                  <Link href={`/products/${prod.slug}`} className="shrink-0">
                    <Image
                      src={ prod.images?.[0] || "/placeholder.jpg"}
                      alt={prod.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${prod.slug}`} className="font-bold text-charcoal text-lg hover:underline">
                      {prod.title}
                    </Link>
                    <div className="text-coral font-bold">${prod.price}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(line.id, line.quantity - 1)} disabled={line.quantity <= 1} className="px-2 py-0.5 bg-gray-200 rounded text-lg font-bold">-</button>
                      <span className="px-2">{line.quantity}</span>
                      <button onClick={() => updateQty(line.id, line.quantity + 1)} className="px-2 py-0.5 bg-gray-200 rounded text-lg font-bold">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(line.id)} className="text-gray-400 hover:text-coral text-2xl ml-2">×</button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center border-t pt-6 mt-6">
            <div className="font-semibold text-lg">Total:</div>
            <div className="font-bold text-2xl text-coral">${total}</div>
          </div>
          <div className="flex justify-center  align-baseline border-t pt-6 mt-6 md:flex-row flex-col gap-4">
            <button
              onClick={() => {
                if (checkoutUrl) window.location.href = checkoutUrl;
              }}
              className="w-full py-3 rounded-full bg-coral text-white font-bold text-lg hover:bg-coral/90 transition block text-center"
              disabled={!checkoutUrl}
            >
              Checkout
            </button>
            <button onClick={clearCart} className=" w-full py-3  rounded-full bg-gray-100 text-gray-500 font-medium hover:bg-gray-200">Clear cart</button>
          </div>
        </>
      )}
    </div>
  );
} 