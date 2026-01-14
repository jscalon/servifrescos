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
              hasPermission("add_product") ||
              hasPermission("change_product")) && (
              <Button
                text="Productos 🍗"
                onClick={() => navigate("products")}
              />
            )}
            {(hasPermission("view_price") || hasPermission("add_price")) && (
              <Button text="Precios 💲" onClick={() => navigate("prices")} />
            )}
            {(hasPermission("view_store") ||
              hasPermission("add_store") ||
              hasPermission("change_store")) && (
              <Button text="Tiendas 🏪" onClick={() => navigate("stores")} />
            )}
            {(hasPermission("view_user") ||
              hasPermission("add_user") ||
              hasPermission("change_user")) && (
              <Button text="Usuarios 👥" onClick={() => navigate("users")} />
            )}
            {hasPermission("view_category") && (
              <Button
                text="Categorías 📂"
                onClick={() => navigate("categories")}
              />
            )}
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
