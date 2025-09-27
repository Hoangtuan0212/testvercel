import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Product interface
interface Product {
  id: number;
  title: string;
  price: number;
  discount?: number;
  thumbnail?: string;
  colors?: string[];
  sizes?: string[];
  code?: string;
  status?: string;
}

// CartItem interface
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

// Cart interface
export interface Cart {
  CartItems: CartItem[];
  totalQuantity: number;
}

// CartContextProps interface
interface CartContextProps {
  cart: Cart;
  totalQuantity: number; // ✅ expose trực tiếp
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
}

// Context
const CartContext = createContext<CartContextProps>({
  cart: { CartItems: [], totalQuantity: 0 },
  totalQuantity: 0,
  fetchCart: async () => {},
  addToCart: async () => {},
  removeCartItem: async () => {},
  updateCartItem: async () => {},
});

export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Cart>({ CartItems: [], totalQuantity: 0 });

  axios.defaults.withCredentials = true;

  const fetchCart = async () => {
    if (status !== "authenticated" || !session) {
      setCart({ CartItems: [], totalQuantity: 0 });
      return;
    }
    try {
      const res = await axios.get("/api/cart", { withCredentials: true });
      setCart({
        CartItems: res.data.cartItems || [],
        totalQuantity: res.data.totalQuantity || 0,
      });
    } catch (error) {
      console.error("fetchCart error:", error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (status !== "authenticated" || !session) return;
    try {
      await axios.post("/api/cart", { productId, quantity }, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      console.error("addToCart error:", error);
    }
  };

  const removeCartItem = async (cartItemId: number) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      console.error("removeCartItem error:", error);
    }
  };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      await axios.patch(`/api/cart/${cartItemId}`, { quantity }, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      console.error("updateCartItem error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session, status]);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity: cart.totalQuantity,
        fetchCart,
        addToCart,
        removeCartItem,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
