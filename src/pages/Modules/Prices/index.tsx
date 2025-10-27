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
            <BackButton />
            <h2 className="h-dark">Servifresco:</h2>
            <Button text="Bejuma" onClick={() => navigate("history")} />
            <Button text="Caracas" onClick={() => navigate("history")} />
            <Button text="Maracay" onClick={() => navigate("history")} />
          </div>
        </main>
      )}
      <Outlet />
    </>
  );
}
