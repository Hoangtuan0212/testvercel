import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import ProductPopup from "./ProductPopup";
import { useSession } from "next-auth/react";
import AuthPopup from "../auth/AuthPopup";
import styles from "../../styles/ProductCard.module.css";

interface Product {
  id: number;
  title: string;
  price: number;
  discount?: number;
  gallery: { thumbnail: string }[]; // Lưu ý: mỗi phần tử là object có thuộc tính thumbnail
  colors?: string[];
  sizes?: string[];
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onOpenPopup: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenPopup }) => {
  const [hovered, setHovered] = useState(false);
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);

  // Lấy ảnh chính và ảnh hover từ gallery (sử dụng đúng thuộc tính thumbnail)
  const mainImage = product.gallery?.[0]?.thumbnail || "/placeholder.png";
  const hoverImage = product.gallery?.[1]?.thumbnail || mainImage;

  const finalPrice = product.discount
    ? Math.round((product.price * (100 - product.discount)) / 100)
    : product.price;
  const rating = product.rating || 5;

  const handleAddToCart = () => {
    if (!session) {
      setShowAuth(true);
      return;
    }
    onOpenPopup(product);
  };

  return (
    <div
      className={styles.productCard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={mainImage}
          alt={product.title}
          fill
          className={styles.productImage}
        />
        {product.gallery.length > 1 && (
          <div
            className={styles.hoverOverlay}
            style={{
              transform: hovered ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <Image
              src={hoverImage}
              alt={`${product.title} - hover`}
              fill
              className={styles.productImage}
            />
          </div>
        )}
        {hovered && (
          <div
            className={styles.hoverOverlay}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => onOpenPopup(product)}
              className={styles.quickViewBtn}
            >
              👁
            </button>
          </div>
        )}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.topRow}>
          {product.colors && product.colors.length > 0 && (
            <div className={styles.colorRow}>
              {product.colors.slice(0, 3).map((color, idx) => (
                <span
                  key={idx}
                  className={styles.colorDot}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <span className={styles.sizeLabel}>
              +{product.sizes.length} Kích thước
            </span>
          )}
        </div>

        <Link href={`/products/${product.id}`}>
          <h2 className={styles.productTitle}>{product.title}</h2>
        </Link>

        <div className={styles.ratingRow}>
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
          <span className={styles.ratingCount}>({rating})</span>
        </div>

        <p className={styles.price}>{finalPrice.toLocaleString("vi-VN")}₫</p>

        <button onClick={handleAddToCart} className={styles.addCartBtn}>
          <span>THÊM VÀO GIỎ</span>
          <FaShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {showAuth && (
        <AuthPopup
          show={true}
          setShow={() => setShowAuth(false)}
          language="vi"
          translations={{
            vi: {
              loginTitle: "Đăng nhập",
              signupTitle: "Đăng ký",
            },
          }}
        />
      )}

      {/* Popup được hiển thị từ index.tsx */}
    </div>
  );
};

export default ProductCard;
