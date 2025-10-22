import styles from "./NotFound.module.css";
import protinalLogo from "../../assets/protinal-logo.jpg";
import proagroLogo from "../../assets/proagro-logo.jpg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <BackButton />
      <h1 className="h-light">404 - Error</h1>
      <h3 className="h-light">Página no encontrada</h3>
      <div className={styles.logos}>
        <img src={protinalLogo} alt="" />
        <img src={proagroLogo} alt="" />
      </div>
      <p className="p-light">Lo siento, la página que buscas no existe...</p>
      <Button text="Volver al inicio" className={styles.button} onClick={() => navigate("/")} />
    </>
  );
}
