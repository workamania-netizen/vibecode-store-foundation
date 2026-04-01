"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadCart, saveCart } from "@/lib/cart-storage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  productSlug: string;
  variantSku: string;
  name: string;        // product name
  variantName: string;  // e.g. "16 oz Jar"
  price: number;        // cents — from config at time of add
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productSlug: string; variantSku: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productSlug: string; variantSku: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { productSlug, variantSku, quantity: qty, ...rest } = action.payload;
      const addQty = qty ?? 1;
      const existing = state.items.find(
        (item) => item.productSlug === productSlug && item.variantSku === variantSku
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productSlug === productSlug && item.variantSku === variantSku
              ? { ...item, quantity: item.quantity + addQty }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { productSlug, variantSku, ...rest, quantity: addQty }],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) =>
            !(item.productSlug === action.payload.productSlug &&
              item.variantSku === action.payload.variantSku)
        ),
      };

    case "UPDATE_QUANTITY": {
      const { productSlug, variantSku, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (item) =>
              !(item.productSlug === productSlug && item.variantSku === variantSku)
          ),
        };
      }
      return {
        items: state.items.map((item) =>
          item.productSlug === productSlug && item.variantSku === variantSku
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    case "HYDRATE":
      return { items: action.payload };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productSlug: string, variantSku: string) => void;
  updateQuantity: (productSlug: string, variantSku: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadCart();
    if (stored.length > 0) {
      dispatch({ type: "HYDRATE", payload: stored });
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCart(state.items);
    }
  }, [state.items, isHydrated]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (productSlug: string, variantSku: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productSlug, variantSku } });
  };

  const updateQuantity = (productSlug: string, variantSku: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productSlug, variantSku, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
