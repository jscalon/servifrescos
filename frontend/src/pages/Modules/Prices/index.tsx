import styles from "./Prices.module.css";
import PriceBar from "../../../components/PriceBar";
import { useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { pricesAPI, type Price } from "../../../services/api";

export default function Prices() {
  const location = useLocation();
  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await pricesAPI.getAll();
        setPrices(response.data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };
    fetchPrices();
  }, []);

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
            <tbody>
              {prices.map((price) => (
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
        </main>
      )}
      <Outlet />
    </>
  );
}
