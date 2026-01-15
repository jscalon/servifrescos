import styles from "./QueryUsers.module.css";
import QueryUsersBar from "../../../../components/QueryUsersBar";
import { useState, useEffect } from "react";
import {
  usersAPI,
  permissionsAPI,
  type User,
  type Permission,
} from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

export default function QueryUsers() {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [permissionOptions, setPermissionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  if (!hasPermission("view_user")) {
    return (
      <main className={styles.main}>
        <h1>Usuarios</h1>
        <span className={styles.error}>
          No tienes permisos para consultar usuarios
        </span>
      </main>
    );
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load permissions
        const permResponse = await permissionsAPI.getAll();
        const options = permResponse.data.map((perm: Permission) => ({
          value: perm.name,
          label: perm.name, // Usar name como label por ahora
        }));
        setPermissionOptions(options);

        // Load users
        const userResponse = await usersAPI.getAll();
        const sortedUsers = userResponse.data.sort(
          (a, b) =>
            new Date(b.date_joined).getTime() -
            new Date(a.date_joined).getTime()
        );
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (filters: {
    nameEmail: string;
    permissions: string;
    active: string;
  }) => {
    let filtered = users;

    if (filters.nameEmail.trim()) {
      const nameEmailLower = filters.nameEmail.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(nameEmailLower) ||
          user.email.toLowerCase().includes(nameEmailLower)
      );
    }

    if (filters.permissions.trim()) {
      const permissionsLower = filters.permissions.toLowerCase();
      filtered = filtered.filter((user) =>
        user.permissions.some((perm) => {
          const label =
            permissionOptions.find((opt) => opt.value === perm)?.label || perm;
          return label.toLowerCase().includes(permissionsLower);
        })
      );
    }

    if (filters.active !== "Todos") {
      const isActive = filters.active === "✅";
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
  };

  const handleClear = () => {
    setFilteredUsers(users);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Usuarios</h1>
        <span className={styles.loading}>Cargando usuarios...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <h1>Usuarios</h1>
        <span className={styles.error}>{error}</span>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Consultar Usuarios</h1>
      <QueryUsersBar onSearch={handleSearch} onClear={handleClear} />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Permisos</th>
            <th>Último Inicio de Sesión</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>{user.email}</td>
              <td>
                {user.permissions
                  .map(
                    (perm) =>
                      permissionOptions.find((opt) => opt.value === perm)
                        ?.label || perm
                  )
                  .join(", ")}
              </td>
              <td>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                    })
                  : "Nunca"}
              </td>
              <td>{user.is_active ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUsers.length === 0 && (
        <span className={styles.noResults}>Sin coincidencias...</span>
      )}
    </main>
  );
}
