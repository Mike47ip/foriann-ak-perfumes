"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  ReactNode,
} from "react";
import { Product, CartItem } from "./data";

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: number }
  | { type: "CHANGE_QTY"; id: number; delta: number };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const exists = state.find((i) => i.id === action.product.id);
      if (exists) return state.map((i) => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "CHANGE_QTY":
      return state
        .map((i) => i.id === action.id ? { ...i, qty: i.qty + action.delta } : i)
        .filter((i) => i.qty > 0);
    default:
      return state;
  }
}

interface CartContextValue {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((v) => !v),
        addToCart: (product) => dispatch({ type: "ADD", product }),
        removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
        changeQty: (id, delta) => dispatch({ type: "CHANGE_QTY", id, delta }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
