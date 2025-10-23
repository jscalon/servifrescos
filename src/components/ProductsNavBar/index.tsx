import styles from "./ProductsNavBar.module.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <Link to="modules/products/create" className={styles.navLink}>
        Creación
      </Link>
      <Link to="modules/products/modify" className={styles.navLink}>
        Modificación
      </Link>
      <Link to="modules/products/query" className={styles.navLink}>
        Consulta
      </Link>
    </nav>
  );
}
