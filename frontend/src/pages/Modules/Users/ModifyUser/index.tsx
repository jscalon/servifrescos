import styles from "./ModifyUser.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState } from "react";
import { usersAPI, type User } from "../../../../services/api";

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  permissions: string[];
}

export default function ModifyUser() {
  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    isActive: true,
    permissions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [userFound, setUserFound] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const permissionOptions = [
    { value: "view_product", label: "Consultar productos" },
    { value: "add_product", label: "Crear productos" },
    { value: "change_product", label: "Modificar productos" },
    { value: "view_price", label: "Consultar precios" },
    { value: "add_price", label: "Crear Precios" },
    { value: "view_user", label: "Consultar usuarios" },
    { value: "add_user", label: "Crear usuarios" },
    { value: "change_user", label: "Modificar usuarios" },
  ];

  const handleCurrentEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmail(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const searchUser = async () => {
    if (!currentEmail.trim()) {
      setError("Por favor ingrese un email");
      return;
    }

    setSearching(true);
    setError("");

    try {
      // Buscar el usuario por email
      const response = await usersAPI.getAll();
      const users: User[] = response.data;
      const user = users.find(
        (u) => u.email.toLowerCase() === currentEmail.trim().toLowerCase()
      );

      if (user) {
        setFormData({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active,
          permissions: user.permissions || [],
        });
        setUserId(user.id);
        setUserFound(true);
        setError("");
      } else {
        setError("Usuario no encontrado");
        setUserFound(false);
      }
    } catch (error) {
      console.error("Error buscando usuario:", error);
      setError("Error al buscar el usuario");
      setUserFound(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      setError("Primero busque un usuario para modificar");
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");

    try {
      await usersAPI.update(userId!, {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        permissions: formData.permissions,
        is_active: formData.isActive,
      });
      setShowSuccessDialog(true);

      // Reiniciar formulario
      setCurrentEmail("");
      setUserId(null);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        isActive: true,
        permissions: [],
      });
      setUserFound(false);
    } catch (error) {
      console.error("Error modificando usuario:", error);
      setError("Error al modificar el usuario. Inténtalo de nuevo.");
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

  const handleClear = () => {
    setCurrentEmail("");
    setUserId(null);
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      isActive: true,
      permissions: [],
    });
    setError("");
    setUserFound(false);
  };

  // Manejador de teclas para atajos de teclado en el formulario de modificación
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading && userFound) {
      e.preventDefault();
      // Verificar que el formulario sea válido antes de enviar
      const form = e.currentTarget;
      if (form.checkValidity()) {
        handleSubmit(e);
      } else {
        // Si no es válido, mostrar errores de validación del navegador
        form.reportValidity();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUser();
    }
  };

  return (
    <main>
      <h1>Modificar Usuario</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
      >
        <BackButton to="/modules/users" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.currentEmail}>
          <FieldWrapper label="Email Actual" id="current_email">
            <InputText
              id="current_email"
              name="current_email"
              value={currentEmail}
              onChange={handleCurrentEmailChange}
              onKeyDown={handleKeyDown}
              disabled={userFound} // Bloquear después de buscar
            />
          </FieldWrapper>
          {!userFound && (
            <Button
              text={searching ? "Cargando..." : "Aceptar"}
              onClick={searchUser}
              disabled={searching}
              style="primary"
            />
          )}
        </div>

        {userFound && (
          <>
            <div className={styles.row}>
              <FieldWrapper label="Nombre" id="firstName">
                <InputText
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
              <FieldWrapper label="Apellido" id="lastName">
                <InputText
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
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
                onClick={handleClear}
              />
              <Button
                text={loading ? "Guardando..." : "Guardar"}
                className={styles.buttonGuardar}
                type="submit"
                disabled={loading}
              />
            </div>

            {/* Modal de confirmación reutilizable */}
            {showConfirmDialog && (
              <ConfirmationModal
                title="Confirmar Modificación"
                message="¿Está seguro de que desea modificar este usuario?"
                onConfirm={handleConfirmSave}
                onCancel={handleCancelSave}
              />
            )}
          </>
        )}

        {/* Modal de éxito reutilizable - Fuera del bloque userFound */}
        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El usuario ha sido modificado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
