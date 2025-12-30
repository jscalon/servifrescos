import styles from "./Prices.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { usePermissions } from "../../../contexts";

export default function Prices() {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/prices" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <BackButton to="/modules" />
            <h2 className="h-dark">Precios:</h2>
            {hasPermission("add_price") && (
              <Button text="Crear 📝" onClick={() => navigate("create")} />
            )}
            {hasPermission("view_price") && (
              <Button text="Consultar 📋" onClick={() => navigate("query")} />
            )}
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
