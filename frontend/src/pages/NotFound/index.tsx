import styles from "./NotFound.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <h1 className="h-light">404 - Error</h1>
      <h3 className="h-light">Página no encontrada</h3>
      <div className={styles.logos}>
        <img src={logos} />
      </div>
      <h3 className={`${styles.text} h-light`}>Lo siento, la página que buscas no existe...</h3>
      <Button text="Volver atrás..." onClick={() => navigate(-1)} />
    </main>
  );
}
