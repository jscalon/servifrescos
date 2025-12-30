import styles from "./Products.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { usePermissions } from "../../../contexts";

export default function Products() {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/products" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <BackButton to="/modules" />
            <h2 className="h-dark">Productos:</h2>
            {hasPermission('add_product') && (
              <Button text="Crear 📝" onClick={() => navigate("create")} />
            )}
            {hasPermission('change_product') && (
              <Button text="Modificar 🔄" onClick={() => navigate("modify")} />
            )}
            {hasPermission('view_product') && (
              <Button text="Consultar 📋" onClick={() => navigate("query")} />
            )}
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
