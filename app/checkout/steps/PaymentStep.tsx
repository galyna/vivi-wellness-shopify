"use client";
import { useCheckoutStore, PaymentData } from "@/app/store/checkoutStore";
import { useState } from "react";

const initialErrors = {
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvc: "",
};

export default function PaymentStep() {
  const { payment, setPayment, setStep } = useCheckoutStore();
  const [form, setForm] = useState<PaymentData>(payment);
  const [errors, setErrors] = useState(initialErrors);

  const validate = () => {
    if (form.method === "cod") return true;
    const newErrors = { ...initialErrors };
    if (!/^\d{16}$/.test(form.cardNumber || "")) newErrors.cardNumber = "Enter 16 digits";
    if (!form.cardName?.trim()) newErrors.cardName = "Enter the name on the card";
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry || "")) newErrors.cardExpiry = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cardCvc || "")) newErrors.cardCvc = "3-4 digits";
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleNext = () => {
    if (validate()) {
      setPayment(form);
      setStep(4);
    }
  };

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <div className="flex gap-4 mb-4">
        <label className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer ${form.method === "card" ? "border-coral bg-coral/10" : "border-gray-300"}`}>
          <input type="radio" name="method" checked={form.method === "card"} onChange={() => setForm(f => ({ ...f, method: "card" }))} /> Card online
        </label>
        <label className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer ${form.method === "cod" ? "border-coral bg-coral/10" : "border-gray-300"}`}>
          <input type="radio" name="method" checked={form.method === "cod"} onChange={() => setForm(f => ({ ...f, method: "cod" }))} /> On delivery
        </label>
      </div>
      {form.method === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Card number</label>
            <input type="text" inputMode="numeric" maxLength={16} className={`w-full border rounded px-3 py-2 ${errors.cardNumber ? "border-red-400" : "border-gray-300"}`} value={form.cardNumber || ""} onChange={e => setForm(f => ({ ...f, cardNumber: e.target.value.replace(/\D/g, "") }))} placeholder="0000 0000 0000 0000" />
            {errors.cardNumber && <div className="text-red-500 text-xs mt-1">{errors.cardNumber}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name on card</label>
            <input type="text" className={`w-full border rounded px-3 py-2 ${errors.cardName ? "border-red-400" : "border-gray-300"}`} value={form.cardName || ""} onChange={e => setForm(f => ({ ...f, cardName: e.target.value }))} placeholder="IVAN IVANOV" />
            {errors.cardName && <div className="text-red-500 text-xs mt-1">{errors.cardName}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry</label>
            <input type="text" maxLength={5} className={`w-full border rounded px-3 py-2 ${errors.cardExpiry ? "border-red-400" : "border-gray-300"}`} value={form.cardExpiry || ""} onChange={e => setForm(f => ({ ...f, cardExpiry: e.target.value.replace(/[^\d\/]/g, "") }))} placeholder="MM/YY" />
            {errors.cardExpiry && <div className="text-red-500 text-xs mt-1">{errors.cardExpiry}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVV/CVC</label>
            <input type="text" maxLength={4} className={`w-full border rounded px-3 py-2 ${errors.cardCvc ? "border-red-400" : "border-gray-300"}`} value={form.cardCvc || ""} onChange={e => setForm(f => ({ ...f, cardCvc: e.target.value.replace(/\D/g, "") }))} placeholder="123" />
            {errors.cardCvc && <div className="text-red-500 text-xs mt-1">{errors.cardCvc}</div>}
          </div>
        </div>
      )}
      <div className="flex gap-2 mt-8">
        <button type="button" onClick={() => setStep(2)} className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">Back</button>
        <button type="submit" className="flex-1 py-2 rounded-full bg-coral text-white font-bold hover:bg-coral/90">Next</button>
      </div>
    </form>
  );
} 