import styles from "./ModifyGroup.module.css";
import Button from "../../../../../components/Button";
import FieldWrapper from "../../../../../components/FieldWrapper";
import InputText from "../../../../../components/InputText";
import Select from "../../../../../components/Select";
import BackButton from "../../../../../components/BackButton";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  categoriesAPI,
  type Group,
  type Department,
} from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";

interface SearchFormData {
  code: string;
}

interface ModifyFormData {
  newCode: string;
  newDescription: string;
  newDepartment: string;
}

export default function ModifyGroup() {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Placeholder permission
  if (!hasPermission("manage_category")) {
    return (
      <main>
        <h1>Modificar Grupo</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/groups" />
          <div className={styles.error}>
            No tienes permisos para modificar grupos
          </div>
        </div>
      </main>
    );
  }

  const [searchData, setSearchData] = useState<SearchFormData>({ code: "" });
  const [modifyData, setModifyData] = useState<ModifyFormData>({
    newCode: "",
    newDescription: "",
    newDepartment: "",
  });
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchData({ code: value.toUpperCase() });
  };

  const handleModifyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setModifyData((prev) => ({
      ...prev,
      [name]:
        name === "newCode" || name === "newDescription"
          ? value.toUpperCase()
          : value,
    }));
  };

  const handleSearch = async () => {
    if (!searchData.code.trim()) {
      setError("Ingrese el código del grupo a buscar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Since API doesn't have search by code, fetch all and find
      const response = await categoriesAPI.groups.getAll();
      const group = response.data.find(
        (g) => g.code.toLowerCase() === searchData.code.toLowerCase(),
      );
      if (group) {
        setSelectedGroup(group);
        setModifyData({
          newCode: group.code,
          newDescription: group.description,
          newDepartment: group.department.toString(),
        });
      } else {
        setError("Grupo no encontrado.");
      }
    } catch (error) {
      console.error("Error buscando grupo:", error);
      setError("Error al buscar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGroup) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    if (!selectedGroup) return;
    setLoading(true);
    setError("");

    try {
      await categoriesAPI.groups.update(selectedGroup.code, {
        code: modifyData.newCode,
        description: modifyData.newDescription,
        department: parseInt(modifyData.newDepartment),
      });
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error modificando grupo:", error);
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError("Error modificando grupo: Ya existe un grupo con ese código.");
      } else {
        setError("Error al modificar el grupo. Inténtalo de nuevo.");
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
    navigate("/modules/categories/groups");
  };

  const handleClear = () => {
    setSearchData({ code: "" });
    setModifyData({ newCode: "", newDescription: "", newDepartment: "" });
    setSelectedGroup(null);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (!selectedGroup) {
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
      <h1>Modificar Grupo</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/groups" />
        {error && <div className={styles.error}>{error}</div>}

        {!selectedGroup ? (
          <div className={styles.searchRow}>
            <FieldWrapper label="Código del Grupo" id="searchCode">
              <InputText
                id="searchCode"
                name="searchCode"
                value={searchData.code}
                onChange={handleSearchChange}
                placeholder="Ingrese el código del grupo a modificar"
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
                  value={selectedGroup.code}
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
                  value={selectedGroup.description}
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
            <div className={styles.row}>
              <FieldWrapper label="Departamento Actual" id="currentDepartment">
                <InputText
                  id="currentDepartment"
                  name="currentDepartment"
                  value={
                    departments.find((d) => d.id === selectedGroup.department)
                      ?.description || ""
                  }
                  disabled
                />
              </FieldWrapper>
              <FieldWrapper label="Nuevo Departamento" id="newDepartment">
                <Select
                  id="newDepartment"
                  name="newDepartment"
                  value={modifyData.newDepartment}
                  onChange={handleModifyChange}
                  required
                >
                  <option value="">(seleccionar)</option>
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
          </>
        )}

        {showConfirmDialog && (
          <ConfirmationModal
            title="Confirmar Modificación"
            message="¿Está seguro de que desea modificar este grupo?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El grupo ha sido modificado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
