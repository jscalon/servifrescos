import styles from "./PricesNavBar.module.css";
import { Link, useLocation } from "react-router-dom";

export default function PricesNavBar() {
  const location = useLocation();
  const links = [
    { to: "list", label: "Listado" },
    { to: "create", label: "Creación" },
  ];

  return (
    <nav className={styles.navBar}>
      {links.map(({ to, label }) => {
        const isActive = location.pathname === `/modules/prices/${to}`;
        return (
          <Link
            key={to}
            to={`modules/prices/${to}`}
            className={`${styles.navLink} ${isActive ? styles.currentLink : ""}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
