import styles from "./QueryPrices.module.css";
import QueryPricesBar from "../../../../components/QueryPricesBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const [currentFilters, setCurrentFilters] = useState<{
    article: string;
    store: string;
    active: string;
  }>({ article: "", store: "Todos", active: "Todos" });
  const intervalRef = useRef<number | null>(null);

  const applyFilters = (
    pricesList: Price[],
    filters: typeof currentFilters,
  ) => {
    let filtered = pricesList;

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

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricesAPI.getAll();
        setPrices(response.data);
        applyFilters(response.data, currentFilters);
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
  }, [location.state, currentFilters]);

  useEffect(() => {
    const startPolling = () => {
      intervalRef.current = setInterval(async () => {
        if (!loading) {
          try {
            const response = await pricesAPI.getAll();
            setPrices(response.data);
            applyFilters(response.data, currentFilters);
          } catch (error) {
            console.error("Error fetching prices:", error);
          }
        }
      }, 1000);
    };

    startPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading, currentFilters]);

  const handleSearch = (filters: {
    article: string;
    store: string;
    active: string;
  }) => {
    setCurrentFilters(filters);
    applyFilters(prices, filters);
  };

  const handleClear = () => {
    setCurrentFilters({ article: "", store: "Todos", active: "Todos" });
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
        <QueryPricesBar
          onSearch={handleSearch}
          onClear={handleClear}
          filteredData={filteredPrices}
        />
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
                <td>
                  {[
                    new Date(price.registration_date).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }),
                    <br />,
                    new Date(price.registration_date).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  ]}
                </td>
                <td>
                  {[
                    new Date(price.effective_date).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }),
                    <br />,
                    new Date(price.effective_date).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  ]}
                </td>
                <td>
                  {price.expiration_date
                    ? [
                        new Date(price.expiration_date).toLocaleString(
                          "es-ES",
                          {
                            timeZone: "America/Caracas",
                            hour12: false,
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        ),
                        <br />,
                        new Date(price.expiration_date).toLocaleString(
                          "es-ES",
                          {
                            timeZone: "America/Caracas",
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        ),
                      ]
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
