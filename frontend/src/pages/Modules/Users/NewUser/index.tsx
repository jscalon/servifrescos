import styles from "./NewUser.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputPassword from "../../../../components/InputPassword";
import Select from "../../../../components/Select";
import BackButton from "../../../../components/BackButton";
import { useState } from "react";
import { usersAPI } from "../../../../services/api";
import type { UserCreate } from "../../../../services/api";

interface NewUserFormData {
  email: string;
  isActive: boolean;
  permissions: string[];
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function NewUser() {
  const [formData, setFormData] = useState<NewUserFormData>({
    email: "",
    isActive: true,
    permissions: [],
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, name]
        : prev.permissions.filter((p) => p !== name),
    }));
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      setError("Por favor complete todos los campos obligatorios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dataToSend: UserCreate = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        permissions: formData.permissions,
        is_active: formData.isActive,
      };
      await usersAPI.create(dataToSend);

      alert("Usuario creado exitosamente!");
      setFormData({
        email: "",
        isActive: true,
        permissions: [],
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      console.error("Error creando usuario:", error);
      setError("Error al crear el usuario. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: "",
      isActive: true,
      permissions: [],
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setError("");
  };

  return (
    <main>
      <h1>Nuevo Usuario</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton to="/modules/users" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Email" id="email">
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Contraseña" id="password">
            <InputPassword
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Confirmar Contraseña" id="confirmPassword">
            <InputPassword
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Nombre" id="firstName">
            <InputText
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Apellido" id="lastName">
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
        </div>
        <FieldWrapper
          label="Usuario Activo"
          id="isActive"
          className={styles.active}
        >
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleIsActiveChange}
          />
        </FieldWrapper>
        <FieldWrapper label="Permisos" id="permissions">
          <div className={styles.permissions}>
            <div className={styles.permissionsColumn}>
              {permissionOptions.slice(0, 4).map((option) => (
                <label key={option.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={option.value}
                    checked={formData.permissions.includes(option.value)}
                    onChange={handlePermissionChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <div className={styles.permissionsColumn}>
              {permissionOptions.slice(4, 8).map((option) => (
                <label key={option.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={option.value}
                    checked={formData.permissions.includes(option.value)}
                    onChange={handlePermissionChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </FieldWrapper>

        <div className={styles.rowButtons}>
          <Button
            text="Reiniciar"
            style="secondary"
            className={styles.buttonReiniciar}
            type="button"
            onClick={handleReset}
          />
          <Button
            text={loading ? "Guardando..." : "Guardar"}
            className={styles.buttonGuardar}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </main>
  );
}
