import styles from "./Modules.module.css";
import Button from "../../components/Button";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Modules() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {location.pathname === "/modules" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <h2 className="h-dark">Módulo:</h2>
            <Button text="Productos 🍗" onClick={() => navigate("products")} />
            <Button text="Precios 💲" onClick={() => navigate("prices")}/>
            <Button text="Permisos 👥" />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
