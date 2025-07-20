import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  cartCreate,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
  getCart,
  ShopifyCart,
  ShopifyCartLine
} from "@/lib/shopify-cart";

interface ShopifyCartState {
  cartId: string | null;
  lines: ShopifyCartLine[];
  subtotal: number;
  checkoutUrl: string | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQty: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<ShopifyCartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      lines: [],
      subtotal: 0,
      checkoutUrl: null,
      loading: false,
      error: null,
      fetchCart: async (): Promise<void> => {
        set({ loading: true, error: null });
        let cartId: string | null = get().cartId || (typeof window !== 'undefined' ? localStorage.getItem('shopify-cart-id') : null);
        try {
          let cart: ShopifyCart;
          if (cartId) {
            cart = await getCart(cartId);
          } else {
            cart = await cartCreate();
            cartId = cart.id;
            if (typeof window !== 'undefined') localStorage.setItem('shopify-cart-id', cartId);
          }
          set({
            cartId: cart.id,
            lines: cart.lines,
            subtotal: cart.subtotal,
            checkoutUrl: cart.checkoutUrl,
            loading: false,
            error: null
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Cart fetch error';
          set({ loading: false, error: err });
        }
      },
      addToCart: async (merchandiseId, quantity = 1): Promise<void> => {
        set({ loading: true, error: null });
        let cartId: string | null = get().cartId;
        try {
          if (!cartId) {
            const cart = await cartCreate();
            cartId = cart.id;
            if (typeof window !== 'undefined') localStorage.setItem('shopify-cart-id', cartId);
          }
          const cart = await cartLinesAdd(cartId!, merchandiseId, quantity);
          set({
            cartId: cart.id,
            lines: cart.lines,
            subtotal: cart.subtotal,
            checkoutUrl: cart.checkoutUrl,
            loading: false,
            error: null
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Add to cart error';
          set({ loading: false, error: err });
        }
      },
      removeFromCart: async (lineId): Promise<void> => {
        set({ loading: true, error: null });
        const cartId = get().cartId;
        if (!cartId) {
          set({ loading: false, error: 'No cart' });
          return;
        }
        try {
          const cart = await cartLinesRemove(cartId, lineId);
          set({
            lines: cart.lines,
            subtotal: cart.subtotal,
            checkoutUrl: cart.checkoutUrl,
            loading: false,
            error: null
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Remove from cart error';
          set({ loading: false, error: err });
        }
      },
      updateQty: async (lineId, quantity): Promise<void> => {
        set({ loading: true, error: null });
        const cartId = get().cartId;
        if (!cartId) {
          set({ loading: false, error: 'No cart' });
          return;
        }
        try {
          const cart = await cartLinesUpdate(cartId, lineId, quantity);
          set({
            lines: cart.lines,
            subtotal: cart.subtotal,
            checkoutUrl: cart.checkoutUrl,
            loading: false,
            error: null
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Update qty error';
          set({ loading: false, error: err });
        }
      },
      clearCart: async (): Promise<void> => {
        set({ loading: true, error: null });
        const cartId = get().cartId;
        if (!cartId) {
          set({ lines: [], subtotal: 0, checkoutUrl: null, loading: false, error: null });
          return;
        }
        try {
          const cart = await getCart(cartId);
          if (cart.lines.length === 0) {
            set({ lines: [], subtotal: 0, checkoutUrl: cart.checkoutUrl, loading: false, error: null });
            return;
          }
          const lineIds: string[] = cart.lines.map((l) => l.id);
          let updatedCart = cart;
          for (const lineId of lineIds) {
            updatedCart = await cartLinesRemove(cartId, lineId);
          }
          set({
            lines: [],
            subtotal: 0,
            checkoutUrl: updatedCart.checkoutUrl,
            loading: false,
            error: null
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Clear cart error';
          set({ loading: false, error: err });
        }
      }
    }),
    { name: "shopify-cart-zustand" }
  )
); 