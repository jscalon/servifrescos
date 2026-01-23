import styles from "./QuerySubgroups.module.css";
import { useState, useEffect } from "react";
import {
  categoriesAPI,
  type Subgroup,
  type Group,
  type Department,
} from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";
import BackButton from "../../../../../components/BackButton";
import QuerySubgroupsBar from "../../../../../components/QuerySubgroupsBar";

export default function QuerySubgroups() {
  const { hasPermission } = usePermissions();

  // Placeholder permission
  if (!hasPermission("view_category")) {
    return (
      <main>
        <h1>Consultar Subgrupos</h1>
        <div className={`card ${styles.form}`}>
          <div className={styles.error}>
            No tienes permisos para consultar subgrupos
          </div>
        </div>
      </main>
    );
  }

  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredSubgroups, setFilteredSubgroups] = useState<Subgroup[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subgroupsResponse, groupsResponse, departmentsResponse] =
          await Promise.all([
            categoriesAPI.subgroups.getAll(),
            categoriesAPI.groups.getAll(),
            categoriesAPI.departments.getAll(),
          ]);
        setSubgroups(subgroupsResponse.data);
        setFilteredSubgroups(subgroupsResponse.data);
        setGroups(groupsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar los subgrupos.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const filtered = subgroups.filter((subgroup) => {
      const group = groups.find((g) => g.id === subgroup.group);
      const dept = group
        ? departments.find((d) => d.id === group.department)
        : null;
      return (
        subgroup.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subgroup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group &&
          group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (dept &&
          dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredSubgroups(filtered);
  }, [searchTerm, subgroups, groups, departments]);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Consultar Subgrupos</h1>
        <span className={styles.loading}>Cargando subgrupos...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Consultar Subgrupos</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/subgroups" />
          <div className={styles.error}>{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Subgrupos</h1>
      <QuerySubgroupsBar
        onSearch={setSearchTerm}
        onClear={() => setSearchTerm("")}
        filteredData={filteredSubgroups.map((subgroup) => {
          const group = groups.find((g) => g.id === subgroup.group);
          const dept = group
            ? departments.find((d) => d.id === group.department)
            : null;
          return {
            ...subgroup,
            group: group ? group.description : "",
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
            <th>Grupo</th>
            <th>Departamento</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubgroups.map((subgroup) => {
            const group = groups.find((g) => g.id === subgroup.group);
            const dept = group
              ? departments.find((d) => d.id === group.department)
              : null;
            return (
              <tr key={subgroup.id}>
                <td>{subgroup.code}</td>
                <td>{subgroup.description}</td>
                <td>{group ? group.description : ""}</td>
                <td>{dept ? dept.description : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredSubgroups.length === 0 && (
        <span className={styles.noSubgroups}>Sin coincidencias...</span>
      )}
    </main>
  );
}
