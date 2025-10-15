import styles from "./Header.module.css";
import logo from "../../assets/servifresco-logo.png";
import NavBar from "../NavBar/NavBar";
import UserSection from "../UserSection/UserSection";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const clickableLogo = !["/login", "/dashboard"].includes(location.pathname);

  return (
    <header className={styles.header}>
      {clickableLogo ? (
        <img
          src={logo}
          alt="servifresco-logo"
          className={styles.clickableLogo}
          onClick={() => navigate("/dashboard")}
        />
      ) : (
        <img src={logo} alt="servifresco-logo" className={styles.logo} />
      )}
			<NavBar></NavBar>
      <UserSection />
    </header>
  );
}
