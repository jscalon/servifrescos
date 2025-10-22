import styles from "./Products.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const isExactProducts = location.pathname === "/products";
  return (
    <>
      {isExactProducts && (
        <Card className={styles.card}>
          <h2 className="h-dark">Productos:</h2>
          <Button text="Creación 📝" onClick={() => navigate("create")} />
          <Button text="Modificación 🔄" onClick={() => navigate("modify")} />
          <Button text="Consulta 🔍" />
        </Card>
      )}
      <Outlet />
    </>
  );
}
