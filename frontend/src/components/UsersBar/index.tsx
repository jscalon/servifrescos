import styles from "./UsersBar.module.css";
import Button from "../Button";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../Select";

interface UsersBarProps {
  onSearch: (filters: {
    nameEmail: string;
    permissions: string;
    active: string;
  }) => void;
  onClear: () => void;
}

export default function UsersBar({ onSearch, onClear }: UsersBarProps) {
  const navigate = useNavigate();
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
    active: string
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

  return (
    <div className={styles.usersBar}>
      <BackButton to="/modules" />
      <span className={styles.span}>Usuario:</span>
      <InputText
        id="nameEmail"
        name="nameEmail"
        className={styles.input}
        value={nameEmail}
        onChange={handleNameEmailChange}
        placeholder="Nombre o Email..."
      />
      <span className={styles.span}>Permisos:</span>
      <InputText
        id="permissions"
        name="permissions"
        className={styles.input}
        value={permissions}
        onChange={handlePermissionsChange}
        placeholder="Permisos..."
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
      <Button
        text="Nuevo +👤"
        className={styles.button}
        onClick={() => navigate("new")}
      />
    </div>
  );
}
