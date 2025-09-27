import React from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext"; // đường dẫn đúng tới CartContext

const CartIcon: React.FC = () => {
  const { cart } = useCart();
  const { totalQuantity } = cart; // lấy totalQuantity từ cart

  return (
    <Link href="/cart">
      <a className="relative inline-block">
        {/* Icon giỏ hàng */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
          />
        </svg>

        {/* Badge số lượng */}
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalQuantity}
          </span>
        )}
      </a>
    </Link>
  );
};

export default CartIcon;
