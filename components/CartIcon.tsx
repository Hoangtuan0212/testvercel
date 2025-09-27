// components/CartIcon.tsx
import { useState, useEffect, useRef } from "react";
import CartPopup from "./CartPopup";
import { useCart } from "../context/CartContext";

const CartIcon = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartPopupRef = useRef<HTMLDivElement>(null);

  // Lấy tổng số lượng từ cart trong context
  const { cart } = useCart();        // <-- sửa ở đây
  const { totalQuantity } = cart;    // <-- lấy từ cart

  // Đóng popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartPopupRef.current &&
        !cartPopupRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  return (
    <>
      <div className="relative">
        <button onClick={() => setIsCartOpen(true)}>
          <img
            src="/images/icon/carticon.png"
            alt="Giỏ hàng"
            width={25}
            height={25}
            className="w-8 h-8 object-contain bg-transparent border-none"
          />
          {/* Hiển thị số lượng nếu > 0 */}
          {totalQuantity > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>

      {isCartOpen && (
        <div ref={cartPopupRef}>
          <CartPopup onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </>
  );
};

export default CartIcon;
