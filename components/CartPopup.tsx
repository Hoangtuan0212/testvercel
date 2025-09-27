import React from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

interface CartPopupProps {
  onClose: () => void;
}

export default function CartPopup({ onClose }: CartPopupProps) {
  const { cart, removeCartItem, updateCartItem } = useCart();
  const router = useRouter();

  // Tính tổng tiền
  const totalPrice = cart.CartItems.reduce((acc, item) => {
    if (!item.product) return acc;
    const { price, discount } = item.product;
    const finalPrice = discount ? Math.round((price * (100 - discount)) / 100) : price;
    return acc + finalPrice * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-80 bg-white h-full p-4 flex flex-col relative">
        {/* Nút đóng */}
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-lg font-bold mb-2">Giỏ hàng</h2>

        <div className="flex-1 overflow-y-auto">
          {cart.CartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <img src="/images/icon/emptycart.png" alt="Giỏ hàng trống" className="w-24 mb-2" />
              <p>Chưa có sản phẩm trong giỏ hàng...</p>
              <a href="/products" className="text-blue-500 hover:underline mt-2">
                Trở về trang sản phẩm
              </a>
            </div>
          ) : (
            <ul>
              {cart.CartItems.map(item => {
                const product = item.product;
                if (!product) return null;
                const finalPrice = product.discount
                  ? Math.round((product.price * (100 - product.discount)) / 100)
                  : product.price;

                return (
                  <li key={item.id} className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={product.thumbnail || "/images/placeholder.png"}
                        alt={product.title}
                        className="w-12 h-12 object-cover"
                      />
                      <div className="flex flex-col">
                        <span>{product.title}</span>
                        <span className="text-sm text-gray-500">
                          {finalPrice.toLocaleString("vi-VN")}₫
                        </span>
                        <div className="flex items-center mt-1">
                          <button
                            className="px-2 py-0.5 border"
                            onClick={() => updateCartItem(item.id, Math.max(item.quantity - 1, 1))}
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            className="px-2 py-0.5 border"
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="text-red-500" onClick={() => removeCartItem(item.id)}>
                      ❌
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.CartItems.length > 0 && (
          <div className="mt-4 border-t pt-2 flex flex-col gap-2">
            <div className="flex justify-between font-bold">
              <span>Tổng tiền:</span>
              <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
            </div>
            <button className="bg-blue-500 text-white py-1 rounded">Thanh toán</button>
            <button
              className="border py-1 rounded"
              onClick={() => {
                onClose();
                router.push("/cart");
              }}
            >
              Xem giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
