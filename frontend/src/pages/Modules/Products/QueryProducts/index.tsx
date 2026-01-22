import styles from "./QueryProducts.module.css";
import QueryProductsBar from "../../../../components/QueryProductsBar";
import { useState, useEffect } from "react";
import { productsAPI, type Product } from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

export default function QueryProducts() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("view_product")) {
    return (
      <main>
        <h1>Consultar Productos</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar productos
          </div>
        </div>
      </main>
    );
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const sortedProducts = response.data.sort((a, b) =>
        a.description.localeCompare(b.description),
      );
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (field: string, value: string) => {
    const filtered = products.filter((product) => {
      const fieldValue = (product as any)[field]?.toLowerCase() || "";
      return fieldValue.includes(value.toLowerCase());
    });
    setFilteredProducts(filtered);
  };

  const handleClear = () => {
    setFilteredProducts(products);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Productos</h1>
        <span className={styles.loading}>Cargando productos...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <h1>Consultar Productos</h1>
        <span className={styles.error}>{error}</span>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Productos</h1>
      <QueryProductsBar
        onSearch={handleSearch}
        onClear={handleClear}
        filteredData={filteredProducts}
      />
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
          {filteredProducts.map((product) => (
            <tr key={product.code}>
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
      {filteredProducts.length === 0 && (
        <span className={styles.noProducts}>Sin coincidencias...</span>
      )}
    </main>
  );
}
