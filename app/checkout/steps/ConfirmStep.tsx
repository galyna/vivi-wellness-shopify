"use client";
import { useCheckoutStore } from "@/app/store/checkoutStore";
import { getProducts } from "@/lib/sanityApi";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    // Simulate "sending"
    await new Promise(res => setTimeout(res, 1200));
    const orderId = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    setOrderId(orderId);
    router.push("/checkout/confirmation");
     
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Confirmation</h2>
      <div className="mb-6">
        <div className="font-semibold mb-2">Products:</div>
        <div className="flex flex-col gap-4">
          {order.map(item => {
            const prod = getProduct(item.productId);
            if (!prod) return null;
            return (
              <div key={item.productId} className="flex items-center gap-3 border-b pb-2">
                <Image
                  src={prod.cardImage?.asset?.url || prod.mainImage?.asset?.url || "/placeholder.jpg"}
                  alt={prod.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="font-bold">{prod.title}</div>
                  <div className="text-gray-500 text-xs">Quantity: {item.qty}</div>
                </div>
                <div className="font-bold">${prod.price * item.qty}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
          <span>Subtotal:</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span>{deliveryCost === 0 ? "Free" : `$${deliveryCost}`}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total to pay:</span>
          <span>${grandTotal}</span>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Shipping:</div>
        <div>{shipping.fullName}, {shipping.phone}</div>
        <div>{shipping.email}</div>
        <div>{shipping.city}, {shipping.address}</div>
        <div>Method: {shipping.delivery === "courier" ? "Courier delivery" : "Pickup"}</div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Payment:</div>
        <div>Method: {payment.method === "card" ? "Card online" : "On delivery"}</div>
        {payment.method === "card" && (
          <div className="text-gray-500 text-sm">**** **** **** {payment.cardNumber?.slice(-4)} ({payment.cardName})</div>
        )}
      </div>
      <div className="flex gap-2 mt-8">
        <button type="button" onClick={() => setStep(3)} className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Back</button>
        <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 py-2 rounded-full bg-coral text-white font-bold hover:bg-coral/90 flex items-center justify-center">
          {loading ? <span className="loader mr-2" /> : null}
          Confirm order
        </button>
      </div>
    </div>
  );
} 