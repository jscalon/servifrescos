import styles from "./QueryDepartments.module.css";
import { useState, useEffect } from "react";
import { categoriesAPI, type Department } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";
import BackButton from "../../../../../components/BackButton";
import QueryDepartmentsBar from "../../../../../components/QueryDepartmentsBar";

export default function QueryDepartments() {
  const { hasPermission } = usePermissions();

  // Placeholder permission
  if (!hasPermission("view_category")) {
    return (
      <main>
        <h1>Consultar Departamentos</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar departamentos
          </div>
        </div>
      </main>
    );
  }

  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await categoriesAPI.departments.getAll();
        setDepartments(response.data);
        setFilteredDepartments(response.data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
        setError("Error al cargar los departamentos.");
      } finally {
        setLoading(false);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const filtered = departments.filter(
      (department) =>
        department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Departamentos</h1>
        <span className={styles.loading}>Cargando departamentos...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Consultar Departamentos</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/departments" />
          <div className={styles.error}>{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Departamentos</h1>
      <QueryDepartmentsBar
        onSearch={setSearchTerm}
        onClear={() => setSearchTerm("")}
        filteredData={filteredDepartments}
      />
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((department) => (
            <tr key={department.id}>
              <td>{department.code}</td>
              <td>{department.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredDepartments.length === 0 && (
        <span className={styles.noDepartments}>Sin coincidencias...</span>
      )}
    </main>
  );
}
