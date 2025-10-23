import styles from "./Header.module.css";
import logo from "../../assets/servifresco-logo.png";
import NavBar from "../ProductsNavBar";
import UserSection from "../UserSection";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const clickableLogo = !["/login", "/modules"].includes(location.pathname);
  const showProductsNavBar = [
    "/modules/products/create",
    "/modules/products/modify",
    "/modules/products/query",
  ].includes(location.pathname);

  return (
    <header className={styles.header}>
      {clickableLogo ? (
        <img
          src={logo}
          alt="servifresco-logo"
          className={styles.clickableLogo}
          onClick={() => navigate("/modules")}
        />
      ) : (
        <img src={logo} alt="servifresco-logo" className={styles.logo} />
      )}
      {showProductsNavBar && <NavBar />}
      <UserSection />
    </header>
  );
}
