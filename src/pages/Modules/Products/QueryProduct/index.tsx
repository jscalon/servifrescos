import styles from "./QueryProduct.module.css";
import QueryBar from "../../../../components/QueryBar";

export default function QueryProduct() {
  function arr(n: number) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(false);
    }
    return arr;
  }
  return (
    <main className={styles.main}>
      <h1>Consultar Productos</h1>
      <QueryBar></QueryBar>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Tipo</th>
            <th>Departamento</th>
            <th>Grupo</th>
            <th>Subgrupo</th>
          </tr>
        </thead>
        <tbody>
          {arr(6).map(() => (
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
