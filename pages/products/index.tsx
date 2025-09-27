import { useEffect, useState, useCallback, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Product.module.css";
import ProductCard from "../../components/product/ProductCard";
import ProductPopup from "../../components/product/ProductPopup";

// Interface cho sản phẩm
interface Product {
  id: number;
  title: string;
  price: number;
  discount: number;
  thumbnail: string;
  // Gallery: mảng đối tượng chứa thumbnail
  gallery: { thumbnail: string }[];
  // colors, sizes lưu dưới dạng mảng (đã parse từ JSON)
  colors?: string[];
  sizes?: string[];
  rating?: number;
}

// Interface cho phản hồi API
interface APIResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState<Product | null>(null);

  // Bộ lọc
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState("");
  const [selectedSizes, setSelectedSizes] = useState("");

  // Phân trang & sắp xếp
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;

  // Ref cho bộ lọc (đóng khi click ra ngoài)
  const filterRef = useRef<HTMLDivElement>(null);

  // Hàm fetch sản phẩm từ API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        sort,
        page,
        limit: productsPerPage,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      };

      // Xử lý khoảng giá nếu có
      if (selectedPrice && selectedPrice.includes("-")) {
        const [min, max] = selectedPrice.split("-");
        params.minPrice = Number(min);
        params.maxPrice = Number(max);
      }

      // Lọc màu sắc, kích thước
      params.colors = selectedColors || undefined;
      params.sizes = selectedSizes || undefined;

      console.log("📌 Fetching Products with Params:", params);

      const response: AxiosResponse<APIResponse> = await axios.get<APIResponse>(
        "/api/products",
        { params }
      );

      if (response.data.products) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải sản phẩm:", error);
      alert("Không thể tải sản phẩm, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [
    selectedCategory,
    selectedPrice,
    selectedColors,
    selectedSizes,
    sort,
    page,
    productsPerPage,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Đóng bộ lọc khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  // Mở/đóng popup
  const openPopup = (product: Product) => {
    setPopupProduct(product);
    setShowPopup(true);
  };
  const closePopup = () => {
    setPopupProduct(null);
    setShowPopup(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quần áo Nam</h1>

      <button
        className={styles.filterToggle}
        onClick={() => setShowFilter(true)}
      >
        Bộ Lọc
      </button>

      {showFilter && (
        <>
          <div className={styles.filterOverlay}></div>
          <div className={styles.filterSidebar} ref={filterRef}>
            <button
              className={styles.closeFilter}
              onClick={() => setShowFilter(false)}
            >
              ×
            </button>
            <h3>Danh mục sản phẩm</h3>
            <ul>
              <li onClick={() => setSelectedCategory("all")}>Xem tất cả</li>
              <li onClick={() => setSelectedCategory("ao")}>Áo</li>
              <li onClick={() => setSelectedCategory("quan")}>Quần</li>
            </ul>

            <div style={{ marginTop: "1rem" }}>
              <h3>Màu sắc</h3>
              <select
                value={selectedColors}
                onChange={(e) => setSelectedColors(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
              >
                <option value="">Tất cả</option>
                <option value="#ffffff">White</option>
                <option value="#000000">Black</option>
                <option value="#f5f5dc">Beige</option>
                <option value="#8B4513">Brown</option>
              </select>

              <h3>Kích thước</h3>
              <select
                value={selectedSizes}
                onChange={(e) => setSelectedSizes(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">Tất cả</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className={styles.productCount}>
        {loading ? "Đang tải..." : `${products.length} sản phẩm`}
      </div>

      <div className={styles.productGrid}>
        {loading ? (
          <p>Đang tải...</p>
        ) : products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenPopup={openPopup}
            />
          ))
        )}
      </div>

      {/* Popup chi tiết sản phẩm */}
      {showPopup && popupProduct && (
        <ProductPopup product={popupProduct} onClose={closePopup} />
      )}
    </div>
  );
}
