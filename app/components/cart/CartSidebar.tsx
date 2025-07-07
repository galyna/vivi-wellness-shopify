"use client";
import { useCartSidebarStore } from "@/app/store/cartSidebarStore";
import { useCartStore } from "@/app/store/cartStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/sanityApi";
import { Product } from "@/types";

export default function CartSidebar() {
  const { isOpen, closeSidebar } = useCartSidebarStore();
  const { items, removeFromCart, updateQty, clearCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (isOpen) getProducts().then(setProducts);
  }, [isOpen]);

  const getProduct = (id: string) => products.find(p => p._id === id);
  const total = items.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeSidebar}
      />
      {/* Sidebar */}
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Cart</h2>
          <button onClick={closeSidebar} className="text-2xl text-coral hover:text-charcoal">×</button>
        </div>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">Cart is empty</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {items.map(item => {
              const prod = getProduct(item.productId);
              if (!prod) return null;
              return (
                <div key={item.productId} className="flex items-center gap-3 mb-4 border-b pb-3">
                  <Link href={`/products/${prod.slug}`} onClick={closeSidebar} className="shrink-0">
                    <Image 
                      src={prod.mainImage?.asset?.url || "/placeholder.jpg"} 
                      alt={prod.title} 
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-xl" 
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${prod.slug}`} onClick={closeSidebar} className="font-bold text-charcoal hover:underline">
                      {prod.title}
                    </Link>
                    <div className="text-coral font-bold">${prod.price}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} disabled={item.qty <= 1} className="px-2 py-0.5 bg-gray-200 rounded text-lg font-bold">-</button>
                      <span className="px-2">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, item.qty + 1)} className="px-2 py-0.5 bg-gray-200 rounded text-lg font-bold">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-gray-400 hover:text-coral text-xl ml-2">×</button>
                </div>
              );
            })}
          </div>
        )}
        {/* Total & actions */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-2xl text-coral">${total}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={closeSidebar} className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Continue shopping</button>
            <Link href="/cart" className="flex-1 py-2 rounded-full bg-coral text-white font-bold text-center hover:bg-coral/90" onClick={closeSidebar}>Go to cart</Link>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="mt-3 w-full py-2 rounded-full bg-gray-100 text-gray-500 font-medium hover:bg-gray-200">Clear cart</button>
          )}
        </div>
      </aside>
    </div>
  );
} 