// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import CartToast from "../components/CartToast";

// Interfaces
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

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  CartItems: CartItem[];
  totalQuantity: number;
}

interface CartContextProps {
  cart: Cart;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
}

// Tạo context
const CartContext = createContext<CartContextProps>({
  cart: { CartItems: [], totalQuantity: 0 },
  fetchCart: async () => {},
  addToCart: async () => {},
  removeCartItem: async () => {},
  updateCartItem: async () => {},
});

// Named export useCart
export const useCart = () => useContext(CartContext);

// CartProvider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<Cart>({ CartItems: [], totalQuantity: 0 });
  const [showToast, setShowToast] = useState(false);

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
      console.error("Lỗi fetchCart:", error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (status !== "authenticated" || !session) return;
    try {
      await axios.post("/api/cart", { productId, quantity }, { withCredentials: true });
      await fetchCart();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error("Lỗi addToCart:", error);
    }
  };

  const removeCartItem = async (cartItemId: number) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`, { withCredentials: true });
      await fetchCart();
    } catch (error) {
      console.error("Lỗi removeCartItem:", error);
    }
  };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      await axios.patch(
        `/api/cart/${cartItemId}`,
        { quantity },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      await fetchCart();
    } catch (error) {
      console.error("Lỗi updateCartItem:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session, status]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeCartItem, updateCartItem }}>
      {children}
      {showToast && <CartToast message="Đã thêm vào giỏ hàng!" onClose={() => setShowToast(false)} />}
    </CartContext.Provider>
  );
};

export default CartProvider;
