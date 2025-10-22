import styles from "./Modules.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Modules() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {location.pathname === "/modules" && (
        <Card className={styles.card}>
          <h2 className="h-dark">Módulo:</h2>
          <Button text="Productos 🍗" onClick={() => navigate("products")} />
          <Button text="Precios 💲" />
          <Button text="Permisos 👥" />
        </Card>
      )}
      <Outlet />
    </>
  );
}
