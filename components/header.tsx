import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AuthPopup from "../components/auth/AuthPopup";
import UserMenu from "../components/UserMenu";
import SearchBar from "../components/SearchBar";
import CartIcon from "../components/CartIcon";
import CartPopup from "../components/CartPopup"; // Import popup giỏ hàng
import styles from "../styles/Home.module.css";

// Bổ sung đầy đủ key "Vietnam" và "English"
const translations = {
  Vietnam: {
    home: "Trang Chủ",
    about: "Giới Thiệu",
    products: "Sản Phẩm",
  },
  English: {
    home: "Home",
    about: "About",
    products: "Products",
  },
};

export default function Header() {
  const { data: session } = useSession();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [language, setLanguage] = useState("Vietnam");
  const authPopupRef = useRef(null);
  const cartPopupRef = useRef(null); // Thêm ref cho giỏ hàng

  // State kiểm soát việc header có thu nhỏ không
  const [shrink, setShrink] = useState(false);

  // State mở popup giỏ hàng
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lắng nghe sự kiện scroll
  useEffect(() => {
    function handleScroll() {
      setShrink(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Đóng popup auth khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        authPopupRef.current &&
        !authPopupRef.current.contains(event.target)
      ) {
        setIsAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đóng popup giỏ hàng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartPopupRef.current &&
        !cartPopupRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`${styles.header} ${shrink ? styles.shrink : ""}`}>
      <div className={styles.topRow}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src="/images/icon/logo345.png"
              alt="O2IN Logo"
              width={167}
              height={50}
            />
          </Link>
        </div>

        {/* topBar */}
        <div className={styles.topBar}>
          <UserMenu
            language={language}
            translations={translations}
            setShowAuthPopup={setIsAuthOpen}
          />

          <SearchBar />

          {/* Cart Icon */}
          <div className="relative">
            <CartIcon onClick={() => setIsCartOpen(true)} />
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={styles.languageSelect}
          >
            <option value="Vietnam">Vietnam</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>
              {translations[language]?.home ?? "Home"}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink}>
              {translations[language]?.about ?? "About"}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/products" className={styles.navLink}>
              {translations[language]?.products ?? "Products"}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Auth Popup */}
      {isAuthOpen && (
        <div ref={authPopupRef}>
          <AuthPopup
            show={isAuthOpen}
            setShow={setIsAuthOpen}
            language={language}
            translations={translations}
          />
        </div>
      )}

      {/* Cart Popup */}
      {isCartOpen && (
        <div ref={cartPopupRef}>
          <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </header>
  );
}
