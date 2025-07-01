import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/app/store/cartStore";

export type ShippingData = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  delivery: "courier" | "pickup";
};

export type PaymentData = {
  method: "card" | "cod";
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvc?: string;
};

export interface CheckoutState {
  step: number;
  order: CartItem[];
  shipping: ShippingData;
  payment: PaymentData;
  orderId?: string;
  setStep: (step: number) => void;
  setOrder: (order: CartItem[]) => void;
  setShipping: (data: ShippingData) => void;
  setPayment: (data: PaymentData) => void;
  setOrderId: (id: string) => void;
  reset: () => void;
}

const defaultShipping: ShippingData = {
  fullName: "Petro Petrenko",
  phone: "+380991234567",
  email: "test@mail.com",
  city: "Kyiv",
  address: "Demo street, 1",
  delivery: "courier",
};

const defaultPayment: PaymentData = {
  method: "card",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvc: "",
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 1,
      order: [],
      shipping: defaultShipping,
      payment: defaultPayment,
      orderId: undefined,
      setStep: (step) => set({ step }),
      setOrder: (order) => set({ order }),
      setShipping: (shipping) => set({ shipping }),
      setPayment: (payment) => set({ payment }),
      setOrderId: (orderId) => set({ orderId }),
      reset: () => set({
        step: 1,
        order: [],
        shipping: defaultShipping,
        payment: defaultPayment,
        orderId: undefined,
      }),
    }),
    { name: "vivi-checkout-zustand" }
  )
); 