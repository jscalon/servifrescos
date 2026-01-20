import styles from "../../../Products/CreateProduct/CreateProduct.module.css";
import Button from "../../../../../components/Button";
import FieldWrapper from "../../../../../components/FieldWrapper";
import InputText from "../../../../../components/InputText";
import Select from "../../../../../components/Select";
import BackButton from "../../../../../components/BackButton";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import {
  categoriesAPI,
  type Group,
  type Department,
} from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";

interface SubgroupFormData {
  code: string;
  description: string;
  department: string; // ID as string
  group: string; // ID as string
}

export default function CreateSubgroup() {
  const { hasPermission } = usePermissions();

  // Asumir permiso manage_category, ajustar según se defina
  if (!hasPermission("manage_category")) {
    // Placeholder
    return (
      <main>
        <h1>Crear Subgrupo</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/subgroups" />
          <div className={styles.error}>
            No tienes permisos para crear subgrupos
          </div>
        </div>
      </main>
    );
  }

  const [formData, setFormData] = useState<SubgroupFormData>({
    code: "",
    description: "",
    department: "",
    group: "",
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const filteredGroups = groups.filter(
    (group) =>
      formData.department === "" ||
      group.department.toString() === formData.department,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsResponse, departmentsResponse] = await Promise.all([
          categoriesAPI.groups.getAll(),
          categoriesAPI.departments.getAll(),
        ]);
        setGroups(groupsResponse.data);
        setDepartments(departmentsResponse.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar los grupos y departamentos.");
      }
    };
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "code" || name === "description" ? value.toUpperCase() : value,
      ...(name === "department" ? { group: "" } : {}), // Reset group when department changes
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
      await categoriesAPI.subgroups.create({
        code: formData.code,
        description: formData.description,
        group: parseInt(formData.group),
      });
      setShowSuccessDialog(true);
      setFormData({ code: "", description: "", department: "", group: "" });
    } catch (error: any) {
      console.error("Error creando subgrupo:", error);
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError(
          "Error creando subgrupo: Ya existe un subgrupo con ese código.",
        );
      } else {
        setError("Error al crear el subgrupo. Inténtalo de nuevo.");
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
    setFormData({ code: "", description: "", department: "", group: "" });
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
      <h1>Crear Subgrupo</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/subgroups" />
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
              <option value="">(Seleccionar)</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.description}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Grupo" id="group">
            <Select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              required
              disabled={!formData.department}
            >
              <option value="">(Seleccionar)</option>
              {filteredGroups.map((group) => (
                <option key={group.id} value={group.id.toString()}>
                  {group.description}
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
            message="¿Está seguro de que desea guardar este subgrupo?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El subgrupo ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
