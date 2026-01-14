import styles from "../../Products/Products.module.css";
import Button from "../../../../components/Button";
import BackButton from "../../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { usePermissions } from "../../../../contexts";

export default function Brands() {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/categories/brands" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <BackButton to="/modules/categories" />
            <h2 className="h-dark">Marcas:</h2>
            {/* Ajustar permisos según se definan */}
            <Button text="Crear 📝" onClick={() => navigate("create")} />
            <Button text="Modificar 🔄" onClick={() => navigate("modify")} />
            <Button text="Consultar 📋" onClick={() => navigate("query")} />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}