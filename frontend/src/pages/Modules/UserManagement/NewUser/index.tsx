import styles from "./NewUser.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputPassword from "../../../../components/InputPassword";
import Select from "../../../../components/Select";
import BackButton from "../../../../components/BackButton";
import { useState } from "react";

interface NewUserFormData {
  username: string;
  role: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
}

export default function NewUser() {
  const [formData, setFormData] = useState<NewUserFormData>({
    username: "",
    role: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    secondLastName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      !formData.username ||
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
      // Aquí irá la llamada a la API cuando esté lista
      // await usersAPI.create(formData);

      alert("Usuario creado exitosamente!");

      // Limpiar formulario
      setFormData({
        username: "",
        role: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        middleName: "",
        lastName: "",
        secondLastName: "",
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
      username: "",
      role: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      secondLastName: "",
    });
    setError("");
  };

  return (
    <main>
      <h1>Nuevo Usuario</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Nombre de Usuario" id="username">
            <InputText
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Rol" id="role">
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
              <option value="viewer">Visualizador</option>
            </Select>
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
          <FieldWrapper label="Primer Nombre" id="firstName">
            <InputText
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Segundo Nombre" id="middleName">
            <InputText
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Primer Apellido" id="lastName">
            <InputText
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Segundo Apellido" id="secondLastName">
            <InputText
              id="secondLastName"
              name="secondLastName"
              value={formData.secondLastName}
              onChange={handleInputChange}
            />
          </FieldWrapper>
        </div>
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
