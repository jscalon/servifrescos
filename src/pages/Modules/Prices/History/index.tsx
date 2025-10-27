import styles from "./History.module.css";
import PriceBar from "../../../../components/PriceBar";

export default function History() {
  function arr(n: number) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(false);
    }
    return arr;
  }
  return (
    <main className={styles.main}>
      <h1>Historial de Precios</h1>
      <PriceBar></PriceBar>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Fecha de Efectividad</th>
            <th>Fecha de Vencimiento</th>
            <th>Precio ($)</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {arr(4).map(() => (
            <tr>
              {arr(7).map(() => (
                <td></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
