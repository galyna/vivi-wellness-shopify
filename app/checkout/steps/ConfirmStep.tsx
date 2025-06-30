"use client";
import { useCheckoutStore } from "@/app/store/checkoutStore";
import { getProducts } from "@/lib/sanityApi";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useRouter } from "next/navigation";

export default function ConfirmStep() {
  const { order, shipping, payment, setStep, setOrderId } = useCheckoutStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const getProduct = (id: string) => products.find(p => p._id === id);
  const total = order.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);
  const deliveryCost = shipping.delivery === "courier" ? 0 : 0; // demo: free
  const grandTotal = total + deliveryCost;

  const handleSubmit = async () => {
    setLoading(true);
    // Імітація "відправки"
    await new Promise(res => setTimeout(res, 1200));
    const orderId = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    setOrderId(orderId);
    router.push("/checkout/confirmation");
    // reset(); // якщо треба скидати після сабміту
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Підтвердження замовлення</h2>
      <div className="mb-6">
        <div className="font-semibold mb-2">Товари:</div>
        <div className="flex flex-col gap-4">
          {order.map(item => {
            const prod = getProduct(item.productId);
            if (!prod) return null;
            return (
              <div key={item.productId} className="flex items-center gap-3 border-b pb-2">
                <img src={prod.cardImage?.asset?.url || prod.mainImage?.asset?.url || "/placeholder.jpg"} alt={prod.title} className="w-12 h-12 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-bold">{prod.title}</div>
                  <div className="text-gray-500 text-xs">Кількість: {item.qty}</div>
                </div>
                <div className="font-bold">${prod.price * item.qty}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
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
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Доставка:</div>
        <div>{shipping.fullName}, {shipping.phone}</div>
        <div>{shipping.email}</div>
        <div>{shipping.city}, {shipping.address}</div>
        <div>Спосіб: {shipping.delivery === "courier" ? "Кур&apos;єрська доставка" : "Самовивіз"}</div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Оплата:</div>
        <div>Спосіб: {payment.method === "card" ? "Карткою онлайн" : "При отриманні"}</div>
        {payment.method === "card" && (
          <div className="text-gray-500 text-sm">**** **** **** {payment.cardNumber?.slice(-4)} ({payment.cardName})</div>
        )}
      </div>
      <div className="flex gap-2 mt-8">
        <button type="button" onClick={() => setStep(3)} className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Назад</button>
        <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 py-2 rounded-full bg-coral text-white font-bold hover:bg-coral/90 flex items-center justify-center">
          {loading ? <span className="loader mr-2" /> : null}
          Підтвердити замовлення
        </button>
      </div>
    </div>
  );
} 