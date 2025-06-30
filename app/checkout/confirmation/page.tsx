"use client";
import { useCheckoutStore } from "@/app/store/checkoutStore";
import { getProducts } from "@/lib/sanityApi";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const { orderId, order, shipping, payment, } = useCheckoutStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
    // reset(); // якщо треба скидати після підтвердження
  }, []);

  const getProduct = (id: string) => products.find(p => p._id === id);
  const total = order.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);
  const deliveryCost = shipping.delivery === "courier" ? 0 : 0;
  const grandTotal = total + deliveryCost;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 min-h-[70vh] text-center">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="green"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Дякуємо за ваше замовлення!</h1>
        <div className="text-gray-600 mb-2">Ми надіслали підтвердження на <span className="font-semibold">{shipping.email}</span></div>
        <div className="text-gray-500">Номер вашого замовлення: <span className="font-bold">#{orderId}</span></div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-left mb-8">
        <div className="font-semibold mb-2">Товари:</div>
        <div className="flex flex-col gap-3 mb-4">
          {order.map(item => {
            const prod = getProduct(item.productId);
            if (!prod) return null;
            return (
              <div key={item.productId} className="flex items-center gap-3 border-b pb-2">
                <img src={prod.cardImage?.asset?.url || prod.mainImage?.asset?.url || "/placeholder.jpg"} alt={prod.title} className="w-10 h-10 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-bold">{prod.title}</div>
                  <div className="text-gray-500 text-xs">Кількість: {item.qty}</div>
                </div>
                <div className="font-bold">${prod.price * item.qty}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span>Сума за товари:</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between">
          <span>Доставка:</span>
          <span>{deliveryCost === 0 ? "Безкоштовно" : `$${deliveryCost}`}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Всього до сплати:</span>
          <span>${grandTotal}</span>
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">Доставка:</div>
          <div>{shipping.fullName}, {shipping.phone}</div>
          <div>{shipping.city}, {shipping.address}</div>
          <div>Спосіб: {shipping.delivery === "courier" ? "Кур&apos;єрська доставка" : "Самовивіз"}</div>
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">Оплата:</div>
          <div>Спосіб: {payment.method === "card" ? "Карткою онлайн" : "При отриманні"}</div>
          {payment.method === "card" && (
            <div className="text-gray-500 text-sm">**** **** **** {payment.cardNumber?.slice(-4)} ({payment.cardName})</div>
          )}
        </div>
      </div>
      <Link href="/products" className="inline-block mt-6 px-6 py-3 rounded-full bg-coral text-white font-bold text-lg hover:bg-coral/90 transition">Продовжити покупки</Link>
    </div>
  );
} 