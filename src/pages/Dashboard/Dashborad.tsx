import styles from "./Dashboard.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Card className={styles.card}>
        <h2 className="h-dark">Módulo:</h2>
        <Button text="Productos 🍗" onClick={() => navigate("/products")} />
        <Button text="Precios 💲" />
        <Button text="Permisos 👥" />
      </Card>
    </>
  );
}
