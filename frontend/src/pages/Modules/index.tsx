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
            {(hasPermission("view_product") ||
              hasPermission("manage_product")) && (
              <Button
                text="Productos 🍗"
                onClick={() => navigate("products")}
              />
            )}
            {(hasPermission("view_price") || hasPermission("manage_price")) && (
              <Button text="Precios 💲" onClick={() => navigate("prices")} />
            )}
            {(hasPermission("view_category") ||
              hasPermission("manage_category")) && (
              <Button
                text="Categorías 📂"
                onClick={() => navigate("categories")}
              />
            )}
            {(hasPermission("view_store") || hasPermission("manage_store")) && (
              <Button text="Tiendas 🏪" onClick={() => navigate("stores")} />
            )}
            {(hasPermission("view_user") || hasPermission("manage_user")) && (
              <Button text="Usuarios 👥" onClick={() => navigate("users")} />
            )}
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
