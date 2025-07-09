import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface CartItem {
  productId: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: (products: Product[]) => number;
  getItems: () => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (productId, qty = 1) => {
        set(state => {
          const existing = state.items.find(i => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === productId ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { productId, qty }] };
        });
      },
      removeFromCart: (productId) => {
        set(state => ({ items: state.items.filter(i => i.productId !== productId) }));
      },
      updateQty: (productId, qty) => {
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: (products) => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const prod = products.find(p => p._id === item.productId);
          return sum + (prod ? prod.price * item.qty : 0);
        }, 0);
      },
      getItems: () => get().items,
    }),
    { name: "vivi-cart-zustand" }
  )
); 