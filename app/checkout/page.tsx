"use client";
import { useCheckoutStore } from "@/app/store/checkoutStore";
import { useCartStore } from "@/app/store/cartStore";
import { useEffect } from "react";
import OrderStep from "./steps/OrderStep";
import ShippingStep from "./steps/ShippingStep";
import PaymentStep from "./steps/PaymentStep";
import ConfirmStep from "./steps/ConfirmStep";

const steps = [
  { label: "Cart" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Confirmation" },
];

export default function CheckoutPage() {
  const { step, setOrder} = useCheckoutStore();
  const { items } = useCartStore();

  // On page enter — initialize order from cart
  useEffect(() => {
    setOrder(items);
  }, [items, setOrder]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 min-h-[70vh]">
      <Stepper step={step} />
      <div className="mt-8">
        {step === 1 && <OrderStep />}
        {step === 2 && <ShippingStep />}
        {step === 3 && <PaymentStep />}
        {step === 4 && <ConfirmStep />}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.label} className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step === i + 1 ? "bg-coral text-white border-coral" : step > i + 1 ? "bg-green-400 text-white border-green-400" : "bg-white text-gray-400 border-gray-300"}`}>{i + 1}</div>
          <div className={`mt-2 text-xs font-medium ${step === i + 1 ? "text-coral" : step > i + 1 ? "text-green-500" : "text-gray-400"}`}>{s.label}</div>
          {i < steps.length - 1 && <div className={`h-1 w-full bg-gray-200 mt-2 ${step > i + 1 ? "bg-green-400" : step === i + 1 ? "bg-coral" : "bg-gray-200"}`}></div>}
        </div>
      ))}
    </div>
  );
} 