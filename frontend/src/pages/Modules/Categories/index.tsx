import styles from "../Modules.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import { usePermissions } from "../../../contexts";

export default function Categories() {
  // const { hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/categories" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <BackButton to="/modules" />
            <h2 className="h-dark">Categorías:</h2>
            {/* Agregar botones para cada categoría - ajustar permisos */}
            <Button text="Marcas 🏷️" onClick={() => navigate("brands")} />
            <Button text="Tipos ⚖️" onClick={() => navigate("product-types")} />
            <Button
              text="Departamentos 🏢"
              onClick={() => navigate("departments")}
            />
            <Button text="Grupos 🚚" onClick={() => navigate("groups")} />
            <Button text="Subgrupos 📦" onClick={() => navigate("subgroups")} />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
