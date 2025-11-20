import styles from "./Prices.module.css";
import PriceBar from "../../../components/PriceBar";
import { useLocation, Outlet } from "react-router-dom";

export default function Prices() {
  const location = useLocation();

  function arr(n: number) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(false);
    }
    return arr;
  }

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
                <th>Servifresco</th>
              </tr>
            </thead>
            <tbody>
              {arr(4).map(() => (
                <tr>
                  {arr(8).map(() => (
                    <td></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
      <Outlet />
    </>
  );
}
