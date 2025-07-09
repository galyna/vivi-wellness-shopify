"use client";
import { useCheckoutStore, ShippingData } from "@/app/store/checkoutStore";
import { useState } from "react";

const initialErrors = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
};

export default function ShippingStep() {
  const { shipping, setShipping, setStep } = useCheckoutStore();
  const [form, setForm] = useState<ShippingData>(shipping);
  const [errors, setErrors] = useState(initialErrors);

  const validate = () => {
    const newErrors = { ...initialErrors };
    if (!form.fullName.trim()) newErrors.fullName = "Enter your full name";
    if (!/^\+?\d{10,15}$/.test(form.phone)) newErrors.phone = "Enter a valid phone number";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.city.trim()) newErrors.city = "Enter your city";
    if (!form.address.trim()) newErrors.address = "Enter your address";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleNext = () => {
    if (validate()) {
      setShipping(form);
      setStep(3);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
      <h2 className="text-xl font-bold mb-4">Shipping</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            type="text"
            className={`w-full border rounded px-3 py-2 ${errors.fullName ? "border-red-400" : "border-gray-300"}`}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          />
          {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            className={`w-full border rounded px-3 py-2 ${errors.phone ? "border-red-400" : "border-gray-300"}`}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className={`w-full border rounded px-3 py-2 ${errors.email ? "border-red-400" : "border-gray-300"}`}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            className={`w-full border rounded px-3 py-2 ${errors.city ? "border-red-400" : "border-gray-300"}`}
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
          {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            className={`w-full border rounded px-3 py-2 ${errors.address ? "border-red-400" : "border-gray-300"}`}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Delivery method</label>
        <div className="flex gap-4 mt-1">
          <label
            className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer ${form.delivery === "courier" ? "border-coral bg-coral/10" : "border-gray-300"}`}
          >
            <input
              type="radio"
              name="delivery"
              checked={form.delivery === "courier"}
              onChange={() => setForm((f) => ({ ...f, delivery: "courier" }))}
            />{" "}
            Courier delivery
          </label>
          <label
            className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer ${form.delivery === "pickup" ? "border-coral bg-coral/10" : "border-gray-300"}`}
          >
            <input
              type="radio"
              name="delivery"
              checked={form.delivery === "pickup"}
              onChange={() => setForm((f) => ({ ...f, delivery: "pickup" }))}
            />{" "}
            Pickup
          </label>
        </div>
      </div>
      <div className="flex gap-2 mt-8">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-2 rounded-full bg-coral text-white font-bold hover:bg-coral/90"
        >
          Next
        </button>
      </div>
    </form>
  );
}
