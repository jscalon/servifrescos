import styles from "./Footer.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  return (
    <footer className={styles.footer}>
      {location.pathname.startsWith("/modules") && (
        <img src={logos} alt="logos" className={styles.logos} />
      )}
      <span className={styles.span}>&copy; 2025 Protinal Proagro, C.A.</span>
    </footer>
  );
}
