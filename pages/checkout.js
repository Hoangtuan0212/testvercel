// /pages/checkout.js
import { useState } from "react";
import { useCart } from "../context/CartContext";
import styles from "../styles/Checkout.module.css";

export default function CheckoutPage() {
  const { cartItems, getTotalPrice } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleCheckout = (e) => {
    e.preventDefault();
    // Xử lý thanh toán (ví dụ: gửi order lên API)
    alert(
      `Đơn hàng đã được đặt với địa chỉ: ${address}\nTổng: ${getTotalPrice().toLocaleString(
        "vi-VN"
      )} VNĐ`
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Giỏ hàng trống</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Thanh toán</h2>
      <form onSubmit={handleCheckout} className={styles.checkoutForm}>
        <div className={styles.formGroup}>
          <label>Địa chỉ giao hàng</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phương thức thanh toán</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cod">COD</option>
            <option value="creditcard">Thẻ tín dụng</option>
            <option value="momo">Ví MoMo</option>
          </select>
        </div>
        <div className={styles.orderSummary}>
          <h3>Tổng: {getTotalPrice().toLocaleString("vi-VN")} VNĐ</h3>
        </div>
        <button type="submit" className={styles.orderBtn}>
          Đặt hàng
        </button>
      </form>
    </div>
  );
}
