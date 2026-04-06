import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type AppStore = {
  search: string;
  category: string;
  cartItems: CartItem[];
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      search: "",
      category: "all",
      cartItems: [],
      setSearch: (search) => set({ search }),
      setCategory: (category) => set({ category }),
      addToCart: (item) =>
        set((state) => {
          const alreadyInCart = state.cartItems.some((cartItem) => cartItem.productId === item.productId);
          if (alreadyInCart) {
            return state;
          }
          return { cartItems: [...state.cartItems, item] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.productId !== productId)
        })),
      clearCart: () => set({ cartItems: [] })
    }),
    {
      name: "streamvault-app-store"
    }
  )
);
