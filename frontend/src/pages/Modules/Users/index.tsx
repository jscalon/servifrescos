import styles from "./Users.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Users() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/users" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
            <BackButton to="/modules" />
            <h2 className="h-dark">Usuarios:</h2>
            <Button text="Consultar 📋" onClick={() => navigate("query")} />
            <Button text="Crear 📝" onClick={() => navigate("create")} />
            <Button text="Modificar 🔄" onClick={() => navigate("modify")} />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
