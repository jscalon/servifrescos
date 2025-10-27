import styles from "./ProductsNavBar.module.css";
import { Link, useLocation } from "react-router-dom";

export default function ProductsNavBar() {
  const location = useLocation();

  const links = [
    { to: "create", label: "Creación" },
    { to: "modify", label: "Modificación" },
    { to: "query", label: "Consulta" },
  ];

  return (
    <nav className={styles.navBar}>
      {links.map(({ to, label }) => {
        const isActive = location.pathname === `/modules/products/${to}`;
        return (
          <Link
            key={to}
            to={`modules/products/${to}`}
            className={`${styles.navLink} ${isActive ? styles.currentLink : ""}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
