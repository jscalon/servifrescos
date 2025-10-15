import styles from "./Products.module.css"
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

export default function Products() {
  return (
    <>
      <Card className={styles.card}>
        <h2 className="h-dark">Productos:</h2>
        <Button text="Creación 📝" />
        <Button text="Modificación 🔄" />
        <Button text="Consulta 🔍" />
      </Card>
    </>
  );
}
