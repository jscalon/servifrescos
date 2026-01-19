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

interface DepartmentFormData {
  code: string;
  description: string;
}

export default function CreateDepartment() {
  const { hasPermission } = usePermissions();

  // Asumir permiso manage_category, ajustar según se defina
  if (!hasPermission("manage_category")) {
    // Placeholder
    return (
      <main>
        <h1>Crear Departamento</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/departments" />
          <div className={styles.error}>
            No tienes permisos para crear departamentos
          </div>
        </div>
      </main>
    );
  }

  const [formData, setFormData] = useState<DepartmentFormData>({
    code: "",
    description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
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
      await categoriesAPI.departments.create({ code: formData.code, description: formData.description });
      setShowSuccessDialog(true);
      setFormData({ code: "", description: "" });
    } catch (error: any) {
      console.error("Error creando departamento:", error);
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError("Error creando departamento: Ya existe un departamento con ese código.");
      } else {
        setError("Error al crear el departamento. Inténtalo de nuevo.");
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
    setFormData({ code: "", description: "" });
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
      <h1>Crear Departamento</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/departments" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Código" id="code">
            <InputText
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Descripción" id="description">
            <InputText
              id="description"
              name="description"
              value={formData.description}
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
            message="¿Está seguro de que desea guardar este departamento?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El departamento ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}