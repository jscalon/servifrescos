import styles from "./NotFound.module.css";
import protinalLogo from "../../assets/protinal-logo.jpg";
import proagroLogo from "../../assets/proagro-logo.jpg";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

function NotFound() {
  return (
    <div className={styles.notFound}>
      <Header />
      <h1>404 - Página no encontrada</h1>
      <p>La ruta que buscas no existe.</p>
      <div className={styles.logos}>
        <img src={protinalLogo} alt="" />
        <img src={proagroLogo} alt="" />
      </div>
      <Link to="/">Volver al inicio</Link>
      <Footer />
    </div>
  );
}

export default NotFound;
