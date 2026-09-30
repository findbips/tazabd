import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";
import { DELIVERY_FEE, FREE_DELIVERY_MIN } from "./products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      setQty: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i,
            ),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "taza-cart", skipHydration: true },
  ),
);

export function cartTotals(items: CartItem[]) {
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_MIN || subtotal === 0 ? 0 : DELIVERY_FEE;
  return { count, subtotal, delivery, total: subtotal + delivery };
}
