"use client";
import { useCheckoutStore } from "@/app/store/checkoutStore";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/sanityApi";
import { useEffect, useState } from "react";
import { Product } from "@/types";

export default function OrderStep() {
  const { order, setStep } = useCheckoutStore();
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const getProduct = (id: string) => products.find(p => p._id === id);
  const total = order.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  if (!order.length) {
    return (
      <div className="text-center text-gray-400 py-20">
        Кошик порожній. <button className="text-coral underline" onClick={() => router.push("/products")}>До каталогу</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ваше замовлення</h2>
      <div className="flex flex-col gap-6 mb-8">
        {order.map(item => {
          const prod = getProduct(item.productId);
          if (!prod) return null;
          return (
            <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
              <img src={prod.cardImage?.asset?.url || prod.mainImage?.asset?.url || "/placeholder.jpg"} alt={prod.title} className="w-16 h-16 object-cover rounded-xl" />
              <div className="flex-1">
                <div className="font-bold text-charcoal">{prod.title}</div>
                <div className="text-coral font-bold">${prod.price}</div>
                <div className="text-gray-500 text-sm">Кількість: {item.qty}</div>
              </div>
              <div className="font-bold text-lg">${prod.price * item.qty}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center border-t pt-6 mt-6">
        <div className="font-semibold text-lg">Всього:</div>
        <div className="font-bold text-2xl text-coral">${total}</div>
      </div>
      <div className="flex gap-2 mt-8">
        <button onClick={() => window.history.back()} className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Назад</button>
        <button onClick={() => setStep(2)} className="flex-1 py-2 rounded-full bg-coral text-white font-bold hover:bg-coral/90">Далі</button>
      </div>
    </div>
  );
} 