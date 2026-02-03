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

const translatePermission = (perm: string): string => {
  const translations: Record<string, string> = {
    view_product: "consultar productos",
    manage_product: "gestionar productos",
    view_price: "consultar precios",
    manage_price: "gestionar precios",
    view_category: "consultar categorías",
    manage_category: "gestionar categorías",
    view_store: "consultar tiendas",
    manage_store: "gestionar tiendas",
    view_user: "consultar usuarios",
    manage_user: "gestionar usuarios",
  };
  return translations[perm] || perm;
};

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
          label: translatePermission(perm.name),
        }));
        setPermissionOptions(options);

        // Load users
        const userResponse = await usersAPI.getAll();
        const sortedUsers = userResponse.data.sort(
          (a: User, b: User) =>
            new Date(b.date_joined).getTime() -
            new Date(a.date_joined).getTime(),
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
          user.email.toLowerCase().includes(nameEmailLower),
      );
    }

    if (filters.permissions.trim()) {
      const permissionsLower = filters.permissions.toLowerCase();
      filtered = filtered.filter((user) =>
        user.permissions.some((perm) => {
          const label =
            permissionOptions.find((opt) => opt.value === perm)?.label || perm;
          return label.toLowerCase().includes(permissionsLower);
        }),
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
      <QueryUsersBar
        onSearch={handleSearch}
        onClear={handleClear}
        filteredData={filteredUsers}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Consulta</th>
            <th>Gestión</th>
            <th>Tiendas</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Último Login</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>{user.email}</td>
              <td className={styles.permissions}>
                {user.permissions
                  .map(
                    (perm) =>
                      permissionOptions.find((opt) => opt.value === perm)
                        ?.label || perm,
                  )
                  .filter((p) => p.startsWith("consultar"))
                  .map((p) => (
                    <li className={styles.li}>{p.slice(10)}</li>
                  ))}
              </td>
              <td className={styles.permissions}>
                {user.permissions
                  .map(
                    (perm) =>
                      permissionOptions.find((opt) => opt.value === perm)
                        ?.label || perm,
                  )
                  .filter((p) => p.startsWith("gestionar"))
                  .map((p) => (
                    <li className={styles.li}>{p.slice(10)}</li>
                  ))}
              </td>
              <td className={styles.permissions}>
                {user.stores && user.stores.length > 0 ? (
                  user.stores.map((store) => (
                    <div key={store.id} className={styles.storeTag}>
                      {store.number} - {store.name}
                    </div>
                  ))
                ) : (
                  <span className={styles.noStores}>Sin tiendas asignadas</span>
                )}
              </td>
              <td>
                {new Date(user.date_joined).toLocaleString("es-ES", {
                  timeZone: "America/Caracas",
                  hour12: false,
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
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
