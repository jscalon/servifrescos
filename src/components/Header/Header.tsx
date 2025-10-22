import styles from "./Header.module.css";
import logo from "../../assets/servifresco-logo.png";
import NavBar from "../ProductsNavBar/ProductsNavBar";
import UserSection from "../UserSection/UserSection";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const clickableLogo = !["/login", "/modules"].includes(location.pathname);
  const showNavBar = ["/products"].includes(location.pathname);

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
      {showNavBar && <NavBar/>}
      <UserSection />
    </header>
  );
}
