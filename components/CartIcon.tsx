import React, { useState, useEffect, useRef } from "react";
import CartPopup from "./CartPopup";
import { useCart } from "../context/CartContext";

interface CartIconProps {
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartPopupRef = useRef<HTMLDivElement>(null);

  const { cart } = useCart();
  const totalQuantity = cart?.totalQuantity ?? 0;

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

  const handleClick = () => {
    setIsCartOpen((prev) => !prev);
    onClick?.();
  };

  return (
    <div className="relative">
      <button onClick={handleClick} className="relative focus:outline-none">
        <img
          src="/images/icon/carticon.png"
          alt="Giỏ hàng"
          width={25}
          height={25}
          className="w-8 h-8 object-contain bg-transparent border-none"
        />
        {totalQuantity > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {totalQuantity}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div ref={cartPopupRef} className="absolute z-50">
          <CartPopup onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default CartIcon;
