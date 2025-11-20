import styles from "./Prices.module.css";
import PriceBar from "../../../components/PriceBar";
import { useLocation, Outlet } from "react-router-dom";

export default function Prices() {
  const location = useLocation();

  return (
    <>
      {location.pathname == "/modules/prices" && (
        <main className={styles.main}>
          <h1>Historial de Precios</h1>
          <PriceBar></PriceBar>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Precio ($)</th>
                <th>Fecha de Registro</th>
                <th>Fecha de Efectividad</th>
                <th>Fecha de Vencimiento</th>
                <th>Vigente</th>
                <th>Servifresco</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </main>
      )}
      <Outlet />
    </>
  );
}
