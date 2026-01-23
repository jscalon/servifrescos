import styles from "./QueryGroups.module.css";
import { useState, useEffect } from "react";
import {
  categoriesAPI,
  type Group,
  type Department,
} from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";
import BackButton from "../../../../../components/BackButton";
import QueryGroupsBar from "../../../../../components/QueryGroupsBar";

export default function QueryGroups() {
  const { hasPermission } = usePermissions();

  // Placeholder permission
  if (!hasPermission("view_category")) {
    return (
      <main>
        <h1>Consultar Grupos</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar grupos
          </div>
        </div>
      </main>
    );
  }

  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsResponse, departmentsResponse] = await Promise.all([
          categoriesAPI.groups.getAll(),
          categoriesAPI.departments.getAll(),
        ]);
        setGroups(groupsResponse.data);
        setFilteredGroups(groupsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar los grupos.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const filtered = groups.filter((group) => {
      const dept = departments.find((d) => d.id === group.department);
      const deptName = dept ? `${dept.code} - ${dept.description}` : "";
      return (
        group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deptName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredGroups(filtered);
  }, [searchTerm, groups, departments]);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Grupos</h1>
        <span className={styles.loading}>Cargando grupos...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Consultar Grupos</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/groups" />
          <div className={styles.error}>{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Grupos</h1>
      <QueryGroupsBar
        onSearch={setSearchTerm}
        onClear={() => setSearchTerm("")}
        filteredData={filteredGroups.map((group) => {
          const dept = departments.find((d) => d.id === group.department);
          return {
            ...group,
            department: dept ? dept.description : "",
          };
        })}
      />
      {error && <div className={styles.error}>{error}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map((group) => {
            const dept = departments.find((d) => d.id === group.department);
            return (
              <tr key={group.id}>
                <td>{group.code}</td>
                <td>{group.description}</td>
                <td>{dept ? dept.description : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredGroups.length === 0 && (
        <span className={styles.noGroups}>Sin coincidencias...</span>
      )}
    </main>
  );
}
