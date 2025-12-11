import styles from "./Users.module.css";
import UsersBar from "../../../components/UsersBar";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { usersAPI, type User } from "../../../services/api";

const permissionOptions = [
  { value: "view_product", label: "Consultar productos" },
  { value: "add_product", label: "Crear productos" },
  { value: "change_product", label: "Modificar productos" },
  { value: "view_price", label: "Listar precios" },
  { value: "add_price", label: "Crear Precios" },
  { value: "view_user", label: "Listar usuarios" },
  { value: "add_user", label: "Crear usuarios" },
  { value: "change_user", label: "Modificar usuarios" },
];

export default function Users() {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getAll();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error loading users:", error);
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
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
    <>
      {location.pathname == "/modules/users" && (
        <main className={styles.main}>
          <h1>Usuarios</h1>
          <UsersBar onSearch={handleSearch} onClear={handleClear} />
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Permisos</th>
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
                  <td>{user.is_active ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <span className={styles.noResults}>Sin coincidencias...</span>
          )}
        </main>
      )}
      <Outlet />
    </>
  );
}
