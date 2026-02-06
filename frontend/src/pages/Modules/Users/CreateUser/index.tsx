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
import { usersAPI, permissionsAPI, storesAPI } from "../../../../services/api";
import type { UserCreate, Permission, Store } from "../../../../services/api";
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

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("Debe tener al menos 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una letra mayúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una letra minúscula");
  }
  if (!/\d/.test(password)) {
    errors.push("Debe contener al menos un número");
  }
  return errors;
};

interface CreateUserFormData {
  email: string;
  isActive: boolean;
  permissions: string[];
  stores: number[];
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function CreateUser() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_user")) {
    return (
      <main>
        <h1>Crear Usuario</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/users" />
          <div className={styles.error}>
            No tienes permisos para crear usuarios
          </div>
        </div>
      </main>
    );
  }

  const [formData, setFormData] = useState<CreateUserFormData>({
    email: "",
    isActive: true,
    permissions: [],
    stores: [],
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const updatedFormData = { ...formData, [name]: value };
      if (name === "password") {
        const errors = validatePassword(value);
        setPasswordErrors(errors);
      }
      if (updatedFormData.password !== updatedFormData.confirmPassword) {
        setPasswordMatchError("Las contraseñas no coinciden");
      } else {
        setPasswordMatchError("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordErrors.length > 0 || passwordMatchError) {
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
      stores: [],
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setError("");
    setEmailError("");
    setPasswordErrors([]);
    setPasswordMatchError("");
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
        stores: formData.stores,
        is_active: formData.isActive,
      };
      await usersAPI.create(dataToSend);

      setShowSuccessDialog(true);
      setFormData({
        email: "",
        isActive: true,
        permissions: [],
        stores: [],
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
      setEmailError("");
      setPasswordErrors([]);
      setPasswordMatchError("");
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

  // Separar permisos de consulta y gestión con orden específico
  const viewPermissions = permissionOptions
    .filter((p) => p.value.startsWith("view_"))
    .sort((a, b) => permissionOrder[a.value] - permissionOrder[b.value]);
  const managePermissions = permissionOptions
    .filter((p) => p.value.startsWith("manage_"))
    .sort((a, b) => permissionOrder[a.value] - permissionOrder[b.value]);

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
              error={passwordErrors.length > 0 || !!passwordMatchError}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Confirmar Contraseña" id="confirmPassword">
            <InputPassword
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={passwordErrors.length > 0 || !!passwordMatchError}
              required
            />
          </FieldWrapper>
        </div>
        {passwordMatchError && (
          <div className={styles.passwordError}>{passwordMatchError}</div>
        )}
        {passwordErrors.map((error, index) => (
          <div key={index} className={styles.passwordError}>
            {error}
          </div>
        ))}
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
        <h3 className="h-dark">Permisos</h3>
        <div className={styles.rowPemissions}>
          <FieldWrapper label="Consulta" id="permissions-view">
            <div className={styles.permissions}>
              <div className={styles.permissionsColumn}>
                {viewPermissions.map((option) => (
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
          <FieldWrapper label="Gestión" id="permissions-manage">
            <div className={styles.permissions}>
              <div className={styles.permissionsColumn}>
                {managePermissions.map((option) => (
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
                    {store.name}
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
