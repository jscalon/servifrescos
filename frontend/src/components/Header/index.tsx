import styles from "./Header.module.css";
import logo from "../../assets/servifresco-logo.png";
import ProductsNavBar from "../ProductsNavBar";
import PricesNavBar from "../PricesNavBar";
import UserSection from "../UserSection";
import { useLocation } from "react-router-dom";
import UsersNavBar from "../UsersNavBar";

export default function Header() {
  const location = useLocation();
  const showProductsNavBar = [
    "/modules/products/query",
    "/modules/products/create",
    "/modules/products/modify",
  ].includes(location.pathname);
  const showPricesNavBar = [
    "/modules/prices/query",
    "/modules/prices/create",
  ].includes(location.pathname);
  const showUsersNavBar = [
    "/modules/users/query",
    "/modules/users/create",
    "/modules/users/modify",
  ].includes(location.pathname);

  return (
    <header className={styles.header}>
      <img src={logo} alt="servifresco-logo" className={styles.logo} />
      {/*{showProductsNavBar && <ProductsNavBar />}
      {showPricesNavBar && <PricesNavBar />}
      {showUsersNavBar && <UsersNavBar />}*/}
      <UserSection />
    </header>
  );
}
