import { create } from "zustand";

interface CartSidebarState {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useCartSidebarStore = create<CartSidebarState>((set) => ({
  isOpen: false,
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
})); 

interface CartSidebarState {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

