import styles from "./Header.module.css";
import logo from "../../assets/servifresco-logo.png";
import logos from "../../assets/protinalproagro-logos.png";
import ProductsNavBar from "../ProductsNavBar";
import StoreName from "../StoreName";
import UserSection from "../UserSection";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const showProductsNavBar = [
    "/modules/products/create",
    "/modules/products/modify",
    "/modules/products/query",
  ].includes(location.pathname);
  const showStoreName = [
    "/modules/prices/history",
    "/modules/prices/new",
  ].includes(location.pathname);

  return (
    <header className={styles.header}>
      <img src={logo} alt="servifresco-logo" className={styles.logo} />
      {showProductsNavBar && <ProductsNavBar />}
      {showStoreName && <StoreName />}
      <UserSection />
    </header>
  );
}
