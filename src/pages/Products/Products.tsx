import styles from "./Products.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  return (
    <>
      <Card className={styles.card}>
        <h2 className="h-dark">Productos:</h2>
        <Button text="Creación 📝" onClick={() => navigate("/createproduct")} />
        <Button text="Modificación 🔄" />
        <Button text="Consulta 🔍" />
      </Card>
    </>
  );
}
