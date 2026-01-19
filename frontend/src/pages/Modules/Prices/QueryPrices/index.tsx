import styles from "./QueryPrices.module.css";
import QueryPricesBar from "../../../../components/QueryPricesBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { pricesAPI, type Price } from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

export default function QueryPrices() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("view_price")) {
    return (
      <main>
        <h1>Consultar Precios</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar precios
          </div>
        </div>
      </main>
    );
  }

  const location = useLocation();
  const [prices, setPrices] = useState<Price[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricesAPI.getAll();
        setPrices(response.data);
        setFilteredPrices(response.data);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setError("Error al cargar los precios");
      } finally {
        setLoading(false);
      }
    };
    if (!prices.length || location.state?.refresh) {
      fetchPrices();
    }
  }, [location.state]);

  const handleSearch = (filters: {
    article: string;
    store: string;
    active: string;
  }) => {
    let filtered = prices;

    if (filters.article.trim()) {
      filtered = filtered.filter(
        (price) =>
          price.product_code.toUpperCase().includes(filters.article) ||
          price.product_description.toUpperCase().includes(filters.article),
      );
    }

    if (filters.store !== "Todos") {
      filtered = filtered.filter((price) => price.store_name === filters.store);
    }

    if (filters.active !== "Todos") {
      const isActive = filters.active === "✅";
      filtered = filtered.filter((price) => price.is_active === isActive);
    }

    setFilteredPrices(filtered);
  };

  const handleClear = () => {
    setFilteredPrices(prices);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Precios</h1>
        <span className={styles.loading}>Cargando precios...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <h1>Precios</h1>
        <span className={styles.error}>{error}</span>
      </main>
    );
  }

  return (
    <>
      <main className={styles.main}>
        <h1>Consultar Precios</h1>
        <QueryPricesBar onSearch={handleSearch} onClear={handleClear} />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Servifresco</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Precio ($)</th>
              <th>Fecha de Registro</th>
              <th>Fecha de Efectividad</th>
              <th>Fecha de Vencimiento</th>
              <th>Vigente</th>
              <th>Creado por</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices.map((price) => (
              <tr key={price.id}>
                <td>{price.product_code}</td>
                <td>{price.store_name}</td>
                <td>{price.product_description}</td>
                <td>{price.product_type}</td>
                <td>{price.price}</td>
                <td>{new Date(price.registration_date).toLocaleString()}</td>
                <td>{new Date(price.effective_date).toLocaleString()}</td>
                <td>
                  {price.expiration_date
                    ? new Date(price.expiration_date).toLocaleString()
                    : ""}
                </td>
                <td>{price.is_active ? "✅" : "❌"}</td>
                <td>
                  {price.created_by_username ? (
                    <>
                      {price.created_by_username.split("@")[0]}
                      <br />@{price.created_by_username.split("@")[1]}
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td>{price.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPrices.length === 0 && (
          <span className={styles.noResults}>Sin coincidencias...</span>
        )}
      </main>
    </>
  );
}
