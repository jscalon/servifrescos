import styles from "./Products.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/products" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
						<BackButton to="/modules"/>
            <h2 className="h-dark">Productos:</h2>
            <Button text="Listado 📋" onClick={() => navigate("list")} />
            <Button text="Creación 📝" onClick={() => navigate("create")} />
            <Button text="Modificación 🔄" onClick={() => navigate("modify")} />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
