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
    lastName: "",
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
      setFormData({
        username: "",
        role: "",
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
      username: "",
      role: "",
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
          <FieldWrapper label="Permisos" id="role">
            <input type="checkbox"></input>
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
