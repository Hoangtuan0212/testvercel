import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserMenu from "../components/UserMenu";
import SearchBar from "../components/SearchBar";
import CartIcon from "../components/CartIcon";
import CartPopup from "../components/CartPopup";
import AuthPopup from "../components/auth/AuthPopup";
import styles from "../styles/Home.module.css";

// Bản dịch
const translations = {
  Vietnam: { home: "Trang Chủ", about: "Giới Thiệu", products: "Sản Phẩm" },
  English: { home: "Home", about: "About", products: "Products" },
};

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [language, setLanguage] = useState<"Vietnam" | "English">("Vietnam");
  const [shrink, setShrink] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const authPopupRef = useRef<HTMLDivElement>(null);
  const cartPopupRef = useRef<HTMLDivElement>(null);

  // Scroll shrink header
  useEffect(() => {
    const handleScroll = () => setShrink(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click ngoài Auth Popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authPopupRef.current &&
        !authPopupRef.current.contains(event.target as Node)
      ) {
        setIsAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Click ngoài Cart Popup
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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

        {/* Top Bar */}
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

          {/* Language select */}
          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value as "Vietnam" | "English")
            }
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
          <CartPopup onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
