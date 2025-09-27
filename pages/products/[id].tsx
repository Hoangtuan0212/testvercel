import React, { useState } from "react";
import Image from "next/image";
import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { useCart } from "../../context/CartContext";
import styles from "../../styles/ProductDetail.module.css";
import Link from "next/link";
import ProductPopup from "../../components/product/ProductPopup";

interface Gallery {
  id: number;
  thumbnail: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  thumbnail: string;
  gallery: Gallery[];
  colors?: string[];
  sizes?: string[];
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}

const ProductDetailPage: React.FC<ProductDetailProps> = ({
  product,
  relatedProducts,
  reviews: initialReviews,
}) => {
  const { addToCart } = useCart();

  // Các state cho thông tin sản phẩm
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );

  // State cho sản phẩm liên quan (hover & quick view)
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // State cho review
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [hoverStar, setHoverStar] = useState(0);

  // Giả lập userId = 1 (user đã đăng nhập)
  const userId = 1;

  const finalPrice = product.discount
    ? Math.round((product.price * (100 - product.discount)) / 100)
    : product.price;

  // Thông báo khi thêm giỏ
  const [showNotification, setShowNotification] = useState(false);
  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    alert("Đi tới trang thanh toán...");
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          userId,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        alert("Lỗi: " + error);
        return;
      }
      const res2 = await fetch(`/api/products/${product.id}`);
      if (!res2.ok) {
        alert("Không thể cập nhật review, vui lòng reload trang!");
        return;
      }
      const data = await res2.json();
      if (data && data.reviews) {
        setReviews(data.reviews);
      }
      setShowReviewForm(false);
      setNewReviewRating(5);
      setNewReviewComment("");
      setHoverStar(0);
      alert("Gửi đánh giá thành công!");
    } catch (err) {
      console.error("Lỗi fetch:", err);
      alert("Có lỗi xảy ra khi gửi đánh giá!");
    }
  };

  return (
    <div className={styles.container}>
      {/* Thông báo thêm giỏ */}
      {showNotification && (
        <div className={styles.notification}>
          Đã thêm vào giỏ hàng thành công!
        </div>
      )}

      <div className={styles.topSection}>
        {/* Ảnh trái */}
        <div className={styles.leftCol}>
          <div className={styles.mainImage}>
            {product.gallery.length > 0 ? (
              <Image
                src={product.gallery[mainIndex].thumbnail}
                alt={product.title}
                width={500}
                height={500}
                className={styles.mainImageImg}
              />
            ) : (
              <Image
                src="/placeholder.png"
                alt="Placeholder"
                width={500}
                height={500}
                className={styles.mainImageImg}
              />
            )}
          </div>
          <div className={styles.thumbnailRow}>
            {product.gallery.map((img, idx) => (
              <div
                key={img.id}
                className={`${styles.thumbnailItem} ${
                  idx === mainIndex ? styles.active : ""
                }`}
                onClick={() => setMainIndex(idx)}
              >
                <Image
                  src={img.thumbnail}
                  alt={`${product.title} - ${idx}`}
                  width={70}
                  height={70}
                  className={styles.thumbnailImg}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className={styles.rightCol}>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <div className={styles.ratingRow}>
            <span className={styles.stars}>★★★★☆</span>
            <span className={styles.reviewCount}>4.8 (8 đánh giá)</span>
          </div>
          <div className={styles.promoBanner}>
            <p>
              Giảm 10% khi thanh toán qua Fundiin. <a href="#">Xem chi tiết</a>
            </p>
          </div>
          <p className={styles.price}>{finalPrice.toLocaleString("vi-VN")} đ</p>
          {product.colors && product.colors.length > 0 && (
            <div className={styles.colorSection}>
              <label>Màu sắc:</label>
              <div className={styles.colorOptions}>
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    style={{ backgroundColor: color }}
                    className={`${styles.colorSwatch} ${
                      selectedColor === color ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.sizeSection}>
              <label>Kích thước:</label>
              <div className={styles.sizeOptions}>
                {product.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    className={`${styles.sizeBtn} ${
                      selectedSize === sz ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className={styles.quantityRow}>
            <label>Số lượng:</label>
            <div className={styles.quantityControl}>
              <button
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>
          </div>
          <div className={styles.sizeGuide}>
            <a href="#">Hướng dẫn chọn size</a>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
            <button className={styles.buyNowBtn} onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <h2>Mô tả sản phẩm</h2>
        <p>{product.description}</p>
      </div>

      {/* REVIEW */}
      <div className={styles.reviewSection}>
        <h2>Nhận xét</h2>
        <div className={styles.reviewSummary}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.reviewCount}>
            5 ( {reviews.length} đánh giá )
          </span>
          <button
            className={styles.writeReviewBtn}
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Viết đánh giá
          </button>
        </div>
        <div className={styles.reviewList}>
          {reviews.map((rev) => (
            <div key={rev.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewAuthor}>{rev.author}</span>
                <span className={styles.reviewRating}>
                  {"★".repeat(rev.rating)}
                </span>
              </div>
              <p className={styles.reviewComment}>{rev.comment}</p>
              <div className={styles.reviewDate}>{rev.date}</div>
            </div>
          ))}
        </div>
        {showReviewForm && (
          <div style={{ marginTop: "20px" }}>
            <h3>Gửi đánh giá mới</h3>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Chọn số sao:
            </label>
            <div style={{ marginBottom: "8px" }}>
              {[1, 2, 3, 4, 5].map((starValue) => (
                <span
                  key={starValue}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color:
                      starValue <= (hoverStar || newReviewRating)
                        ? "#ffc107"
                        : "#e4e5e9",
                  }}
                  onClick={() => setNewReviewRating(starValue)}
                  onMouseEnter={() => setHoverStar(starValue)}
                  onMouseLeave={() => setHoverStar(newReviewRating)}
                >
                  ★
                </span>
              ))}
            </div>
            <label>Nội dung bình luận:</label>
            <textarea
              rows={3}
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              style={{ width: "100%", marginTop: "4px" }}
            />
            <button style={{ marginTop: "8px" }} onClick={handleSubmitReview}>
              Gửi đánh giá
            </button>
          </div>
        )}
      </div>

      {/* Sản phẩm liên quan - hiển thị theo giao diện ProductCard */}
      <div className={styles.relatedSection}>
        <h2>Sản phẩm liên quan</h2>
        <div className={styles.productCardSection}>
          {relatedProducts.map((rp) => {
            const rpFinalPrice = rp.discount
              ? Math.round((rp.price * (100 - rp.discount)) / 100)
              : rp.price;
            const rating = rp.rating || 5;
            const mainImage =
              rp.gallery && rp.gallery[0]
                ? rp.gallery[0].thumbnail
                : rp.thumbnail || "/images/placeholder.png";
            const hoverImage =
              rp.gallery && rp.gallery[1] ? rp.gallery[1].thumbnail : mainImage;
            return (
              <div
                key={rp.id}
                className={styles.productCard}
                onMouseEnter={() => setHoveredCardId(rp.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={mainImage}
                    alt={rp.title}
                    layout="fill"
                    className={styles.productImage}
                  />
                  {rp.gallery && rp.gallery.length > 1 && (
                    <div
                      className={styles.hoverOverlay}
                      style={{
                        transform:
                          hoveredCardId === rp.id
                            ? "translateX(0)"
                            : "translateX(-100%)",
                      }}
                    >
                      <Image
                        src={hoverImage}
                        alt={`${rp.title} - hover`}
                        layout="fill"
                        className={styles.productImage}
                      />
                    </div>
                  )}
                  {hoveredCardId === rp.id && (
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
                        className={styles.quickViewBtn}
                        onClick={() => setSelectedProduct(rp)}
                      >
                        👁
                      </button>
                    </div>
                  )}
                </div>
                <div className={styles.infoSection}>
                  <div className={styles.topRow}>
                    {rp.colors && rp.colors.length > 0 && (
                      <div className={styles.colorRow}>
                        {rp.colors.slice(0, 3).map((color, idx) => (
                          <span
                            key={idx}
                            className={styles.colorDot}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                    {rp.sizes && rp.sizes.length > 0 && (
                      <span className={styles.sizeLabel}>
                        +{rp.sizes.length} Kích thước
                      </span>
                    )}
                  </div>
                  <Link href={`/products/${rp.id}`}>
                    <span className={styles.productTitle}>{rp.title}</span>
                  </Link>
                  <div className={styles.ratingRow}>
                    {Array.from({ length: rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    <span className={styles.ratingCount}>({rating})</span>
                  </div>
                  <p className={styles.price}>
                    {rpFinalPrice.toLocaleString("vi-VN")}₫
                  </p>
                  <button
                    className={styles.addCartBtn}
                    onClick={() => addToCart(rp.id, 1)}
                  >
                    THÊM VÀO GIỎ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ProductPopup hiển thị khi có sản phẩm được chọn */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const productRaw = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { gallery: true },
    });
    if (!productRaw) {
      return { notFound: true };
    }

    const product = {
      ...productRaw,
      created_at: productRaw.created_at.toISOString(),
      updated_at: productRaw.updated_at.toISOString(),
      colors: productRaw.colors || [],
      sizes: productRaw.sizes || [],
    };

    // Sản phẩm liên quan
    const relatedRaw = await prisma.product.findMany({
      where: {
        category_id: productRaw.category_id,
        id: { not: productRaw.id },
      },
      take: 4,
    });
    const relatedProducts = relatedRaw.map((item) => ({
      ...item,
      created_at: item.created_at.toISOString(),
      updated_at: item.updated_at.toISOString(),
    }));

    // Lấy review kèm user
    const reviewsRaw = await prisma.review.findMany({
      where: { product_id: productRaw.id },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const reviews = reviewsRaw.map((r) => ({
      id: r.id,
      author: r.user ? `${r.user.firstName} ${r.user.lastName}` : "Anonymous",
      rating: r.rating,
      comment: r.comment || "",
      date: r.created_at.toISOString(),
    }));

    return {
      props: {
        product,
        relatedProducts,
        reviews,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    return {
      props: {
        product: {},
        relatedProducts: [],
        reviews: [],
      },
    };
  }
};
