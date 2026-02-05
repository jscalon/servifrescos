import styles from "./ModifyUser.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputEmail from "../../../../components/InputEmail";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import {
  usersAPI,
  permissionsAPI,
  storesAPI,
  type User,
  type Permission,
  type Store,
} from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

const translatePermission = (perm: string): string => {
  const translations: Record<string, string> = {
    view_product: "Productos",
    manage_product: "Productos",
    view_price: "Precios",
    manage_price: "Precios",
    view_category: "Categorías",
    manage_category: "Categorías",
    view_store: "Tiendas",
    manage_store: "Tiendas",
    view_user: "Usuarios",
    manage_user: "Usuarios",
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

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  permissions: string[];
  stores: number[];
}

export default function ModifyUser() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_user")) {
    return (
      <main>
        <h1>Modificar Usuario</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/users" />
          <div className={styles.error}>
            No tienes permisos para modificar usuarios
          </div>
        </div>
      </main>
    );
  }

  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    isActive: true,
    permissions: [],
    stores: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [userFound, setUserFound] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [permissionOptions, setPermissionOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [availableStores, setAvailableStores] = useState<Store[]>([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await permissionsAPI.getAll();
        const options = response.data.map((perm: Permission) => ({
          value: perm.name,
          label: translatePermission(perm.name),
        }));
        setPermissionOptions(options);
      } catch (error) {
        console.error("Error loading permissions:", error);
      }
    };

    const loadStores = async () => {
      try {
        const response = await storesAPI.getAll();
        setAvailableStores(response.data);
      } catch (error) {
        console.error("Error loading stores:", error);
      }
    };

    loadPermissions();
    loadStores();
  }, []);

  const handleCurrentEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmail(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convertir email a minúsculas
    const processedValue = name === "email" ? value.toLowerCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
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

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const storeId = parseInt(value);

    setFormData((prev) => ({
      ...prev,
      stores: checked
        ? [...prev.stores, storeId]
        : prev.stores.filter((id) => id !== storeId),
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
        (u) => u.email.toLowerCase() === currentEmail.trim().toLowerCase(),
      );

      if (user) {
        setFormData({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active,
          permissions: user.permissions || [],
          stores: user.stores?.map((s) => s.id) || [],
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

    if (emailError) {
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
        stores: formData.stores,
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
        stores: [],
      });
      setEmailError("");
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
      stores: [],
    });
    setError("");
    setEmailError("");
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

  // Separar permisos de consulta y gestión con orden específico
  const viewPermissions = permissionOptions
    .filter((p) => p.value.startsWith("view_"))
    .sort((a, b) => permissionOrder[a.value] - permissionOrder[b.value]);
  const managePermissions = permissionOptions
    .filter((p) => p.value.startsWith("manage_"))
    .sort((a, b) => permissionOrder[a.value] - permissionOrder[b.value]);

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
              <FieldWrapper label="Email" id="email">
                <InputEmail
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onErrorChange={setEmailError}
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
            <h3 className="h-dark">Permisos</h3>
            <div className={styles.rowPemissions}>
              <FieldWrapper label="Consulta" id="permissions-view">
                <div className={styles.permissions}>
                  <div className={styles.permissionsColumn}>
                    {viewPermissions.map((option) => (
                      <label
                        key={option.value}
                        className={styles.checkboxLabel}
                      >
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
              <FieldWrapper label="Gestión" id="permissions-manage">
                <div className={styles.permissions}>
                  <div className={styles.permissionsColumn}>
                    {managePermissions.map((option) => (
                      <label
                        key={option.value}
                        className={styles.checkboxLabel}
                      >
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
            </div>
            <FieldWrapper label="Tiendas" id="stores" className={styles.stores}>
              <div className={styles.permissions}>
                <div className={styles.permissionsColumn}>
                  {availableStores
                    .sort((a, b) => a.number - b.number)
                    .map((store) => (
                      <label key={store.id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name={`store-${store.id}`}
                          value={store.id}
                          checked={formData.stores.includes(store.id)}
                          onChange={handleStoreChange}
                        />
                        {store.number} - {store.name}
                      </label>
                    ))}
                </div>
              </div>
            </FieldWrapper>
            <div className={styles.rowButtons}>
              <Button
                text="Reiniciar"
                style="reset"
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
