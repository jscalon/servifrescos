import styles from "./Modules.module.css";
import Button from "../../components/Button";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { usePermissions } from "../../contexts";

export default function Modules() {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {location.pathname === "/modules" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <h2 className="h-dark">Módulo:</h2>
            {hasPermission('view_product') && (
              <Button text="Productos 🍗" onClick={() => navigate("products")} />
            )}
            {hasPermission('view_price') && (
              <Button text="Precios 💲" onClick={() => navigate("prices")} />
            )}
            {hasPermission('view_user') && (
              <Button text="Usuarios 👥" onClick={() => navigate("users")} />
            )}
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
