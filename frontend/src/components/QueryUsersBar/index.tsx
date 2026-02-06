import styles from "./QueryUsersBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";
import Select from "../Select";
import ExportToExcelButton from "../ExportToExcelButton";
import { type User } from "../../services/api";

interface QueryUsersBarProps {
  onSearch: (filters: {
    nameEmail: string;
    permissions: string;
    active: string;
  }) => void;
  onClear: () => void;
  filteredData: User[];
}

export default function QueryUsersBar({
  onSearch,
  onClear,
  filteredData,
}: QueryUsersBarProps) {
  const [nameEmail, setNameEmail] = useState<string>("");
  const [permissions, setPermissions] = useState<string>("");
  const [selectedActive, setSelectedActive] = useState<string>("Todos");

  const handleNameEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameEmail(value);
    triggerSearch(value, permissions, selectedActive);
  };

  const handlePermissionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPermissions(value);
    triggerSearch(nameEmail, value, selectedActive);
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const active = e.target.value;
    setSelectedActive(active);
    triggerSearch(nameEmail, permissions, active);
  };

  const triggerSearch = (
    nameEmail: string,
    permissions: string,
    active: string,
  ) => {
    onSearch({
      nameEmail: nameEmail.trim(),
      permissions: permissions.trim(),
      active,
    });
  };

  const handleClear = () => {
    setNameEmail("");
    setPermissions("");
    setSelectedActive("Todos");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.queryUsersBar}>
      <BackButton to="/modules/users" />
      <span className={styles.span}>Usuario:</span>
      <InputText
        id="nameEmail"
        name="nameEmail"
        className={styles.input}
        value={nameEmail}
        onChange={handleNameEmailChange}
        onKeyDown={handleKeyDown}
        placeholder="Nombre o Email..."
      />
      <span className={styles.span}>Permisos:</span>
      <InputText
        id="permissions"
        name="permissions"
        className={styles.input}
        value={permissions}
        onChange={handlePermissionsChange}
        onKeyDown={handleKeyDown}
        placeholder="Consulta, Gestión o Tiendas..."
      />
      <span className={styles.span}>Activo:</span>
      <Select
        id="active"
        name="active"
        className={styles.select}
        value={selectedActive}
        onChange={handleActiveChange}
      >
        <option>Todos</option>
        <option>✅</option>
        <option>❌</option>
      </Select>
      <ExportToExcelButton
        data={filteredData.map((user) => {
          // Permisos de consulta ordenados
          const viewPerms = [
            { value: "view_product", label: "Productos" },
            { value: "view_price", label: "Precios" },
            { value: "view_category", label: "Categorías" },
            { value: "view_store", label: "Tiendas" },
            { value: "view_user", label: "Usuarios" },
          ]
            .filter((p) => user.permissions.includes(p.value))
            .map((p) => p.label)
            .join(", ");

          // Permisos de gestión ordenados
          const managePerms = [
            { value: "manage_product", label: "Productos" },
            { value: "manage_price", label: "Precios" },
            { value: "manage_category", label: "Categorías" },
            { value: "manage_store", label: "Tiendas" },
            { value: "manage_user", label: "Usuarios" },
          ]
            .filter((p) => user.permissions.includes(p.value))
            .map((p) => p.label)
            .join(", ");

          // Tiendas ordenadas por número
          const storesText =
            user.stores
              ?.sort((a, b) => a.number - b.number)
              .map((s) => s.name)
              .join(", ") || "";

          return {
            nombre_completo: `${user.first_name} ${user.last_name}`,
            email: user.email,
            consulta: viewPerms,
            gestion: managePerms,
            tiendas: storesText,
            fecha_creacion: user.date_joined
              ? new Date(user.date_joined).toLocaleString("es-ES")
              : "",
            ultimo_login: user.last_login
              ? new Date(user.last_login).toLocaleString("es-ES")
              : "Nunca",
            activo: user.is_active ? "Sí" : "No",
          };
        })}
        headers={[
          "Nombre Completo",
          "Email",
          "Consulta",
          "Gestión",
          "Tiendas",
          "Fecha de Creación",
          "Fecha de Último Login",
          "Activo",
        ]}
        keys={[
          "nombre_completo",
          "email",
          "consulta",
          "gestion",
          "tiendas",
          "fecha_creacion",
          "ultimo_login",
          "activo",
        ]}
        fileName="Usuarios.xlsx"
      />
    </div>
  );
}
