import styles from "./QueryProductTypes.module.css";
import { useState, useEffect } from "react";
import { categoriesAPI, type ProductType } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";
import BackButton from "../../../../../components/BackButton";
import QueryProductTypesBar from "../../../../../components/QueryProductTypesBar";

export default function QueryProductTypes() {
  const { hasPermission } = usePermissions();

  // Placeholder permission
  if (!hasPermission("view_category")) {
    return (
      <main>
        <h1>Consultar Tipos de Producto</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar tipos de producto
          </div>
        </div>
      </main>
    );
  }

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [filteredProductTypes, setFilteredProductTypes] = useState<
    ProductType[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        const response = await categoriesAPI.productTypes.getAll();
        setProductTypes(response.data);
        setFilteredProductTypes(response.data);
      } catch (error) {
        console.error("Error cargando tipos de producto:", error);
        setError("Error al cargar los tipos de producto.");
      } finally {
        setLoading(false);
      }
    };
    loadProductTypes();
  }, []);

  useEffect(() => {
    const filtered = productTypes.filter((productType) =>
      productType.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProductTypes(filtered);
  }, [searchTerm, productTypes]);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Tipos de Producto</h1>
        <span className={styles.loading}>Cargando tipos de producto...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Consultar Tipos de Producto</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/product-types" />
          <div className={styles.error}>{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Tipos de Producto</h1>
      <QueryProductTypesBar
        onSearch={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductTypes.map((productType) => (
            <tr key={productType.id}>
              <td>{productType.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProductTypes.length === 0 && (
        <span className={styles.noProductTypes}>Sin coincidencias...</span>
      )}
    </main>
  );
}
