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
    view_product: "productos",
    manage_product: "productos",
    view_price: "precios",
    manage_price: "precios",
    view_category: "categorías",
    manage_category: "categorías",
    view_store: "tiendas",
    manage_store: "tiendas",
    view_user: "usuarios",
    manage_user: "usuarios",
  };
  return translations[perm] || perm;
};

// Orden de permisos: Productos, Precios, Categorías, Tiendas, Usuarios
const permissionOrder: Record<string, number> = {
  view_product: 1,
  manage_product: 1,
  view_price: 2,
  manage_price: 2,
  view_category: 3,
  manage_category: 3,
  view_store: 4,
  manage_store: 4,
  view_user: 5,
  manage_user: 5,
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

  // Obtener permisos de consulta ordenados
  const getViewPermissions = () => {
    return permissionOptions
      .filter((p) => p.value.startsWith("view_"))
      .sort((a, b) => permissionOrder[a.value] - permissionOrder[b.value]);
  };

  // Obtener permisos de gestión ordenados
  const getManagePermissions = () => {
    return permissionOptions
      .filter((p) => p.value.startsWith("manage_"))
      .sort((a, b) => permissionOrder[a.value] - permissionOrder[b.value]);
  };

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
      filtered = filtered.filter((user) => {
        // Buscar en permisos de consulta
        const viewPerms = getViewPermissions()
          .filter((opt) => user.permissions.includes(opt.value))
          .map((opt) => opt.label.toLowerCase());
        
        // Buscar en permisos de gestión
        const managePerms = getManagePermissions()
          .filter((opt) => user.permissions.includes(opt.value))
          .map((opt) => opt.label.toLowerCase());
        
        // Buscar en tiendas
        const storesText = user.stores
          ?.map((s) => `${s.number} - ${s.name}`.toLowerCase())
          .join(" ") || "";
        
        const allContent = [...viewPerms, ...managePerms, storesText].join(" ");
        
        return allContent.includes(permissionsLower);
      });
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
          {filteredUsers.map((user) => {
            const viewPermsOrdered = getViewPermissions();
            const managePermsOrdered = getManagePermissions();
            return (
              <tr key={user.id}>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>
                  {user.email.split("@")[0]}
                  <br />@{user.email.split("@")[1]}
                </td>
                <td className={styles.permissions}>
                  {viewPermsOrdered
                    .filter((opt) => user.permissions.includes(opt.value))
                    .map((opt) => (
                      <li key={opt.value} className={styles.li}>
                        {opt.label}
                      </li>
                    ))}
                </td>
                <td className={styles.permissions}>
                  {managePermsOrdered
                    .filter((opt) => user.permissions.includes(opt.value))
                    .map((opt) => (
                      <li key={opt.value} className={styles.li}>
                        {opt.label}
                      </li>
                    ))}
                </td>
                <td className={styles.permissions}>
                  {user.stores &&
                    user.stores.length > 0 &&
                    user.stores
                      .sort((a, b) => a.number - b.number)
                      .map((store) => (
                        <div key={store.id} className={styles.li}>
                          {store.name.toLowerCase()}
                        </div>
                      ))}
                </td>
                <td>
                  {[
                    new Date(user.date_joined).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }),
                    <br />,
                    new Date(user.date_joined).toLocaleString("es-ES", {
                      timeZone: "America/Caracas",
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  ]}
                </td>
                <td>
                  {user.last_login
                    ? [
                        new Date(user.last_login).toLocaleString("es-ES", {
                          timeZone: "America/Caracas",
                          hour12: false,
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }),
                        <br />,
                        new Date(user.last_login).toLocaleString("es-ES", {
                          timeZone: "America/Caracas",
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      ]
                    : "Nunca"}
                </td>
                <td>{user.is_active ? "✅" : "❌"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredUsers.length === 0 && (
        <span className={styles.noResults}>Sin coincidencias...</span>
      )}
    </main>
  );
}
