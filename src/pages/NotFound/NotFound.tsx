import styles from "./NotFound.module.css";
import protinalLogo from "../../assets/protinal-logo.jpg";
import proagroLogo from "../../assets/proagro-logo.jpg";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta que buscas no existe.</p>
      <div className={styles.logos}>
        <img src={protinalLogo} alt="" />
        <img src={proagroLogo} alt="" />
      </div>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}

export default NotFound;
