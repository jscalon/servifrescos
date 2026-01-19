import styles from "../../../Products/CreateProduct/CreateProduct.module.css";
import Button from "../../../../../components/Button";
import FieldWrapper from "../../../../../components/FieldWrapper";
import InputText from "../../../../../components/InputText";
import Select from "../../../../../components/Select";
import BackButton from "../../../../../components/BackButton";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import { categoriesAPI, type Department } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";

interface GroupFormData {
  code: string;
  description: string;
  department: string; // ID as string
}

export default function CreateGroup() {
  const { hasPermission } = usePermissions();

  // Asumir permiso manage_category, ajustar según se defina
  if (!hasPermission("manage_category")) {
    // Placeholder
    return (
      <main>
        <h1>Crear Grupo</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/groups" />
          <div className={styles.error}>
            No tienes permisos para crear grupos
          </div>
        </div>
      </main>
    );
  }

  const [formData, setFormData] = useState<GroupFormData>({
    code: "",
    description: "",
    department: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await categoriesAPI.departments.getAll();
        setDepartments(response.data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
        setError("Error al cargar los departamentos.");
      }
    };
    loadDepartments();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "code" || name === "description" ? value.toUpperCase() : value,
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
      await categoriesAPI.groups.create({
        code: formData.code,
        description: formData.description,
        department: parseInt(formData.department),
      });
      setShowSuccessDialog(true);
      setFormData({ code: "", description: "", department: "" });
    } catch (error: any) {
      console.error("Error creando grupo:", error);
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError("Error creando grupo: Ya existe un grupo con ese código.");
      } else {
        setError("Error al crear el grupo. Inténtalo de nuevo.");
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
    setFormData({ code: "", description: "", department: "" });
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
      <h1>Crear Grupo</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/groups" />
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
        <div className={styles.row}>
          <FieldWrapper label="Departamento" id="department">
            <Select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.description}
                </option>
              ))}
            </Select>
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
            message="¿Está seguro de que desea guardar este grupo?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El grupo ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
