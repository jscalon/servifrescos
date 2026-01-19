import styles from "./ModifyDepartment.module.css";
import Button from "../../../../../components/Button";
import FieldWrapper from "../../../../../components/FieldWrapper";
import InputText from "../../../../../components/InputText";
import BackButton from "../../../../../components/BackButton";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesAPI, type Department } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";

interface SearchFormData {
  code: string;
}

interface ModifyFormData {
  newCode: string;
  newDescription: string;
}

export default function ModifyDepartment() {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Placeholder permission
  if (!hasPermission("manage_category")) {
    return (
      <main>
        <h1>Modificar Departamento</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/departments" />
          <div className={styles.error}>
            No tienes permisos para modificar departamentos
          </div>
        </div>
      </main>
    );
  }

  const [searchData, setSearchData] = useState<SearchFormData>({ code: "" });
  const [modifyData, setModifyData] = useState<ModifyFormData>({
    newCode: "",
    newDescription: "",
  });
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchData({ code: value.toUpperCase() });
  };

  const handleModifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModifyData((prev) => ({
      ...prev,
      [name]: name === "newCode" ? value.toUpperCase() : value,
    }));
  };

  const handleSearch = async () => {
    if (!searchData.code.trim()) {
      setError("Ingrese el código del departamento a buscar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Since API doesn't have search by code, fetch all and find
      const response = await categoriesAPI.departments.getAll();
      const department = response.data.find(
        (d) => d.code.toLowerCase() === searchData.code.toLowerCase(),
      );
      if (department) {
        setSelectedDepartment(department);
        setModifyData({
          newCode: department.code,
          newDescription: department.description,
        });
      } else {
        setError("Departamento no encontrado.");
      }
    } catch (error) {
      console.error("Error buscando departamento:", error);
      setError("Error al buscar el departamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDepartment) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    if (!selectedDepartment) return;
    setLoading(true);
    setError("");

    try {
      await categoriesAPI.departments.update(selectedDepartment.code, {
        code: modifyData.newCode,
        description: modifyData.newDescription,
      });
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error modificando departamento:", error);
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError(
          "Error modificando departamento: Ya existe un departamento con ese código.",
        );
      } else {
        setError("Error al modificar el departamento. Inténtalo de nuevo.");
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
    navigate("/modules/categories/departments");
  };

  const handleClear = () => {
    setSearchData({ code: "" });
    setModifyData({ newCode: "", newDescription: "" });
    setSelectedDepartment(null);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (!selectedDepartment) {
        handleSearch();
      } else {
        const form = e.currentTarget;
        if (form.checkValidity()) {
          handleSubmit(e);
        } else {
          form.reportValidity();
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <main>
      <h1>Modificar Departamento</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/departments" />
        {error && <div className={styles.error}>{error}</div>}

        {!selectedDepartment ? (
          <div className={styles.searchRow}>
            <FieldWrapper label="Código del Departamento" id="searchCode">
              <InputText
                id="searchCode"
                name="searchCode"
                value={searchData.code}
                onChange={handleSearchChange}
                placeholder="Ingrese el código del departamento a modificar"
                required
              />
            </FieldWrapper>
            <Button
              text={loading ? "Cargando..." : "Aceptar"}
              onClick={handleSearch}
              disabled={loading}
            />
          </div>
        ) : (
          <>
            <div className={styles.row}>
              <FieldWrapper label="Código Actual" id="currentCode">
                <InputText
                  id="currentCode"
                  name="currentCode"
                  value={selectedDepartment.code}
                  disabled
                />
              </FieldWrapper>
              <FieldWrapper label="Nuevo Código" id="newCode">
                <InputText
                  id="newCode"
                  name="newCode"
                  value={modifyData.newCode}
                  onChange={handleModifyChange}
                  required
                />
              </FieldWrapper>
            </div>
            <div className={styles.row}>
              <FieldWrapper label="Descripción Actual" id="currentDescription">
                <InputText
                  id="currentDescription"
                  name="currentDescription"
                  value={selectedDepartment.description}
                  disabled
                />
              </FieldWrapper>
              <FieldWrapper label="Nueva Descripción" id="newDescription">
                <InputText
                  id="newDescription"
                  name="newDescription"
                  value={modifyData.newDescription}
                  onChange={handleModifyChange}
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
          </>
        )}

        {showConfirmDialog && (
          <ConfirmationModal
            title="Confirmar Modificación"
            message="¿Está seguro de que desea modificar este departamento?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El departamento ha sido modificado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
