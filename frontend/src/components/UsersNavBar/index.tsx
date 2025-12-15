import styles from "./UsersNavBar.module.css";
import { Link, useLocation } from "react-router-dom";

export default function UsersNavBar() {
  const location = useLocation();
  const links = [
    { to: "list", label: "Listado" },
    { to: "create", label: "Creación" },
    { to: "modify", label: "Modificación" },
  ];

  return (
    <nav className={styles.navBar}>
      {links.map(({ to, label }) => {
        const isActive = location.pathname === `/modules/users/${to}`;
        return (
          <Link
            key={to}
            to={`modules/users/${to}`}
            className={`${styles.navLink} ${isActive ? styles.currentLink : ""}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
