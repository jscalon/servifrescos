import styles from "./QueryProduct.module.css";
import QueryBar from "../../../../components/QueryBar";
import { useState, useEffect } from "react";
import { productsAPI, type Product } from "../../../../services/api";

export default function QueryProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Productos</h1>
        <div>Cargando productos...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <h1>Consultar Productos</h1>
        <div style={{color: 'red'}}>{error}</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Productos</h1>
      <QueryBar />
      <table className={styles.table}>
        <thead className={styles.thead}>
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
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.code}</td>
              <td>{product.description}</td>
              <td>{product.brand}</td>
              <td>{product.type}</td>
              <td>{product.department}</td>
              <td>{product.group}</td>
              <td>{product.subgroup}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          No hay productos registrados
        </div>
      )}
    </main>
  );
}
