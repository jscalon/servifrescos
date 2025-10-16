import styles from "./ProductsNavBar.module.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <Link to="" className={styles.navLink}>
        Creación
      </Link>
      <Link to="" className={styles.navLink}>
        Modificación
      </Link>
      <Link to="" className={styles.navLink}>
        Consulta
      </Link>
    </nav>
  );
}
