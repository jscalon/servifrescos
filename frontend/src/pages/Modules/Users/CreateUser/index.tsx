import styles from "./CreateUser.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputEmail from "../../../../components/InputEmail";
import InputPassword from "../../../../components/InputPassword";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import { usersAPI, permissionsAPI } from "../../../../services/api";
import type { UserCreate, Permission } from "../../../../services/api";

interface CreateUserFormData {
  email: string;
  isActive: boolean;
  permissions: string[];
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function CreateUser() {
  const [formData, setFormData] = useState<CreateUserFormData>({
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
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [permissionOptions, setPermissionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await permissionsAPI.getAll();
        const options = response.data.map((perm: Permission) => ({
          value: perm.name,
          label: perm.name, // Usar name como label por ahora
        }));
        setPermissionOptions(options);
      } catch (error) {
        console.error("Error loading permissions:", error);
      }
    };
    loadPermissions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const updatedFormData = { ...formData, [name]: value };
      if (updatedFormData.password !== updatedFormData.confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");
      } else {
        setPasswordError("");
      }
    }
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

    if (passwordError) {
      return;
    }

    if (emailError) {
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

    setShowConfirmDialog(true);
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
    setEmailError("");
    setPasswordError("");
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
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

      setShowSuccessDialog(true);
      setFormData({
        email: "",
        isActive: true,
        permissions: [],
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
      setEmailError("");
      setPasswordError("");
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      if (error.response && error.response.data && error.response.data.email) {
        setError("Error creando usuario: Ya existe un usuario con ese email.");
      } else {
        setError("Error al crear el usuario. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  const handleAcceptSuccess = () => {
    setShowSuccessDialog(false);
  };

  return (
    <main>
      <h1>Crear Usuario</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton to="/modules/users" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Email" id="email">
            <InputEmail
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onErrorChange={setEmailError}
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
              error={!!passwordError}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Confirmar Contraseña" id="confirmPassword">
            <InputPassword
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!passwordError}
              required
            />
          </FieldWrapper>
        </div>
        {passwordError && (
          <div className={styles.passwordError}>{passwordError}</div>
        )}
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
              {permissionOptions.slice(0, 6).map((option) => (
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
              {permissionOptions.slice(6, 11).map((option) => (
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

        {showConfirmDialog && (
          <ConfirmationModal
            title="Confirmar Guardado"
            message="¿Está seguro de que desea guardar este usuario?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El usuario ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
