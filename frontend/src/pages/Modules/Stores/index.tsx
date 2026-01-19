import styles from "./Stores.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { usePermissions } from "../../../contexts";

export default function Stores() {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/stores" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <BackButton to="/modules" />
            <h2 className="h-dark">Tiendas:</h2>
            {hasPermission("manage_store") && [
              <Button text="Crear 📝" onClick={() => navigate("create")} />,
              <Button text="Modificar 🔄" onClick={() => navigate("modify")} />,
            ]}
            {hasPermission("view_store") && (
              <Button text="Consultar 📋" onClick={() => navigate("query")} />
            )}
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
