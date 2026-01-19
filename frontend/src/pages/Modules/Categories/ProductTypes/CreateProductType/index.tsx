import styles from "../../../Products/CreateProduct/CreateProduct.module.css";
import Button from "../../../../../components/Button";
import FieldWrapper from "../../../../../components/FieldWrapper";
import InputText from "../../../../../components/InputText";
import BackButton from "../../../../../components/BackButton";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";
import { categoriesAPI } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";

interface ProductTypeFormData {
  name: string;
}

export default function CreateProductType() {
  const { hasPermission } = usePermissions();

  // Asumir permiso manage_category, ajustar según se defina
  if (!hasPermission("manage_category")) {
    // Placeholder
    return (
      <main>
        <h1>Crear Tipo de Producto</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/product-types" />
          <div className={styles.error}>
            No tienes permisos para crear tipos de producto
          </div>
        </div>
      </main>
    );
  }

  const [formData, setFormData] = useState<ProductTypeFormData>({
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ name: value.toUpperCase() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");

    try {
      await categoriesAPI.productTypes.create({ name: formData.name });
      setShowSuccessDialog(true);
      setFormData({ name: "" });
    } catch (error: any) {
      console.error("Error creando tipo de producto:", error);
      if (error.response?.status === 400 && error.response?.data?.name) {
        setError(
          "Error creando tipo de producto: Ya existe un tipo de producto con ese nombre.",
        );
      } else {
        setError("Error al crear el tipo de producto. Inténtalo de nuevo.");
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

  const handleClear = () => {
    setFormData({ name: "" });
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity()) {
        handleSubmit(e);
      } else {
        form.reportValidity();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <main>
      <h1>Crear Tipo de Producto</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/product-types" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Nombre" id="name">
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
        </div>
        <div className={styles.rowButtons}>
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
            message="¿Está seguro de que desea guardar este tipo de producto?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El tipo de producto ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
