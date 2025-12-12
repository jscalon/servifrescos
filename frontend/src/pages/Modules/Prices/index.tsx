import styles from "./Prices.module.css";
import Button from "../../../components/Button";
import BackButton from "../../../components/BackButton";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function Prices() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {location.pathname === "/modules/prices" && (
        <main className={styles.main}>
          <div className={`card ${styles.card}`}>
						<BackButton to="/modules"/>
            <h2 className="h-dark">Precios:</h2>
            <Button text="Listado 📋" onClick={() => navigate("list")} />
            <Button text="Creación 📝" onClick={() => navigate("create")} />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
