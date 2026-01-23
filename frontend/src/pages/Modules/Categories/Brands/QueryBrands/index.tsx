import styles from "./QueryBrands.module.css";
import { useState, useEffect } from "react";
import { categoriesAPI, type Brand } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";
import BackButton from "../../../../../components/BackButton";
import QueryBrandsBar from "../../../../../components/QueryBrandsBar";

export default function QueryBrands() {
  const { hasPermission } = usePermissions();

  // Placeholder permission
  if (!hasPermission("view_category")) {
    return (
      <main>
        <h1>Consultar Marcas</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar marcas
          </div>
        </div>
      </main>
    );
  }

  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await categoriesAPI.brands.getAll();
        setBrands(response.data);
        setFilteredBrands(response.data);
      } catch (error) {
        console.error("Error cargando marcas:", error);
        setError("Error al cargar las marcas.");
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Marcas</h1>
        <span className={styles.loading}>Cargando marcas...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Consultar Marcas</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/brands" />
          <div className={styles.error}>{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Marcas</h1>
      <QueryBrandsBar
        onSearch={setSearchTerm}
        onClear={() => setSearchTerm("")}
        filteredData={filteredBrands}
      />
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrands.map((brand) => (
            <tr key={brand.id}>
              <td>{brand.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredBrands.length === 0 && (
        <span className={styles.noBrands}>Sin coincidencias...</span>
      )}
    </main>
  );
}
