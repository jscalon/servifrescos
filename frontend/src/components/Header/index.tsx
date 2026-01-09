import styles from "./Header.module.css";
import logo from "../../assets/servifresco-logo.png";
import UserSection from "../UserSection";

export default function Header() {
  return (
    <header className={styles.header}>
      <img src={logo} alt="servifresco-logo" className={styles.logo} />
      <UserSection />
    </header>
  );
}
