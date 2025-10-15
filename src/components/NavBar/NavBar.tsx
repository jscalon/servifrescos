import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li>
          <Link to="/" className={styles.navLink}>
            Creación
          </Link>
        </li>
        <li>
          <Link to="/" className={styles.navLink}>
            Modificación
          </Link>
        </li>
        <li>
          <Link to="/" className={styles.navLink}>
            Consulta
          </Link>
        </li>
      </ul>
    </nav>
  );
}
