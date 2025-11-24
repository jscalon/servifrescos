import styles from "./Prices.module.css";
import PricesBar from "../../../components/PricesBar";
import { useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { pricesAPI, type Price } from "../../../services/api";

export default function Prices() {
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
    fetchPrices();
  }, []);

  const handleSearch = (filters: {
    field: string;
    value: string;
    store: string;
    active: string;
  }) => {
    let filtered = prices;

    if (filters.value) {
      filtered = filtered.filter((price) => {
        let fieldValue: string | number | boolean | null = "";
        switch (filters.field) {
          case "code":
            fieldValue = price.product_code;
            break;
          case "description":
            fieldValue = price.product_description;
            break;
          case "type":
            fieldValue = price.product_type;
            break;
          case "price":
            fieldValue = price.price;
            break;
          case "comment":
            fieldValue = price.comment;
            break;
          default:
            fieldValue = "";
        }
        return fieldValue
          ?.toString()
          .toLowerCase()
          .includes(filters.value.toLowerCase());
      });
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
      {location.pathname == "/modules/prices" && (
        <main className={styles.main}>
          <h1>Precios</h1>
          <PricesBar onSearch={handleSearch} onClear={handleClear} />
          <table>
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
            <tbody>
              {filteredPrices.map((price) => (
                <tr key={price.id}>
                  <td>{price.product_code}</td>
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
                  <td>{price.store_name}</td>
                  <td>{price.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPrices.length === 0 && (
            <span className={styles.noResults}>Sin coincidencias...</span>
          )}
        </main>
      )}
      <Outlet />
    </>
  );
}
