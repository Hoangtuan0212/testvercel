// components/CartIcon.tsx
import { useState, useEffect, useRef } from "react";
import CartPopup from "./CartPopup";
import { useCart } from "../context/CartContext"; // 👈 thêm import useCart

const CartIcon: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartPopupRef = useRef<HTMLDivElement>(null);

  // Lấy tổng số lượng an toàn từ context
  const { cart } = useCart();
  const totalQuantity = cart?.totalQuantity ?? 0;

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsCartOpen((prev) => !prev)}
        className="relative focus:outline-none"
      >
        <img
          src="/images/icon/carticon.png"
          alt="Giỏ hàng"
          width={25}
          height={25}
          className="w-8 h-8 object-contain bg-transparent border-none"
        />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] text-center">
            {totalQuantity}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div
          ref={cartPopupRef}
          className="absolute right-0 mt-2 z-50 shadow-lg bg-white rounded-lg"
        >
          <CartPopup onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default CartIcon;
