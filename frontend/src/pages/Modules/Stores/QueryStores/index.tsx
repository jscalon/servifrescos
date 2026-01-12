import styles from "./QueryStores.module.css";
import QueryStoresBar from "../../../../components/QueryStoresBar";
import { useState, useEffect } from "react";
import { storesAPI } from "../../../../services/api";
import type { Store } from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

export default function QueryStores() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("view_store")) {
    return (
      <main>
        <h1>Consultar Tiendas</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar tiendas
          </div>
        </div>
      </main>
    );
  }

  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await storesAPI.getAll();
        setStores(response.data);
        setFilteredStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setError("Error al cargar las tiendas.");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Tiendas</h1>
        <span className={styles.loading}>Cargando tiendas...</span>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Tiendas</h1>
      <QueryStoresBar
        onSearch={(value) => {
          if (value.trim() === "") {
            setFilteredStores(stores);
          } else {
            const filtered = stores.filter(
              (store) =>
                store.number
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()) ||
                store.name.toLowerCase().includes(value.toLowerCase()) ||
                (store.address?.toLowerCase().includes(value.toLowerCase()) ??
                  false)
            );
            setFilteredStores(filtered);
          }
        }}
      />
      {error && <span className={styles.error}>{error}</span>}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Número</th>
            <th>Nombre</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store) => (
            <tr key={store.number}>
              <td>{store.number}</td>
              <td>{store.name}</td>
              <td>{store.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredStores.length === 0 && (
        <span className={styles.noResults}>Sin coincidencias...</span>
      )}
    </main>
  );
}
