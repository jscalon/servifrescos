import styles from "./ModifySubgroup.module.css";
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
  type Subgroup,
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
  newGroup: string;
}

export default function ModifySubgroup() {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Placeholder permission
  if (!hasPermission("manage_category")) {
    return (
      <main>
        <h1>Modificar Subgrupo</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/subgroups" />
          <div className={styles.error}>
            No tienes permisos para modificar subgrupos
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
    newGroup: "",
  });
  const [selectedSubgroup, setSelectedSubgroup] = useState<Subgroup | null>(
    null,
  );
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const filteredGroups = groups.filter(
    (group) =>
      modifyData.newDepartment === "" ||
      group.department.toString() === modifyData.newDepartment,
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
      ...(name === "newDepartment" ? { newGroup: "" } : {}), // Reset group when department changes
    }));
  };

  const handleSearch = async () => {
    if (!searchData.code.trim()) {
      setError("Ingrese el código del subgrupo a buscar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Since API doesn't have search by code, fetch all and find
      const response = await categoriesAPI.subgroups.getAll();
      const subgroup = response.data.find(
        (s) => s.code.toLowerCase() === searchData.code.toLowerCase(),
      );
      if (subgroup) {
        setSelectedSubgroup(subgroup);
        const group = groups.find((g) => g.id === subgroup.group);
        setModifyData({
          newCode: subgroup.code,
          newDescription: subgroup.description,
          newDepartment: group ? group.department.toString() : "",
          newGroup: subgroup.group.toString(),
        });
      } else {
        setError("Subgrupo no encontrado.");
      }
    } catch (error) {
      console.error("Error buscando subgrupo:", error);
      setError("Error al buscar el subgrupo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSubgroup) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    if (!selectedSubgroup) return;
    setLoading(true);
    setError("");

    try {
      await categoriesAPI.subgroups.update(selectedSubgroup.code, {
        code: modifyData.newCode,
        description: modifyData.newDescription,
        group: parseInt(modifyData.newGroup),
      });
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error modificando subgrupo:", error);
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError(
          "Error modificando subgrupo: Ya existe un subgrupo con ese código.",
        );
      } else {
        setError("Error al modificar el subgrupo. Inténtalo de nuevo.");
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
    navigate("/modules/categories/subgroups");
  };

  const handleClear = () => {
    setSearchData({ code: "" });
    setModifyData({
      newCode: "",
      newDescription: "",
      newDepartment: "",
      newGroup: "",
    });
    setSelectedSubgroup(null);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (!selectedSubgroup) {
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
      <h1>Modificar Subgrupo</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/subgroups" />
        {error && <div className={styles.error}>{error}</div>}

        {!selectedSubgroup ? (
          <div className={styles.searchRow}>
            <FieldWrapper label="Código del Subgrupo" id="searchCode">
              <InputText
                id="searchCode"
                name="searchCode"
                value={searchData.code}
                onChange={handleSearchChange}
                placeholder="Ingrese el código del subgrupo a modificar"
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
                  value={selectedSubgroup.code}
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
                  value={selectedSubgroup.description}
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
                  value={(() => {
                    const currentGroup = groups.find(
                      (g) => g.id === selectedSubgroup.group,
                    );
                    const currentDept = currentGroup
                      ? departments.find(
                          (d) => d.id === currentGroup.department,
                        )
                      : null;
                    return currentDept ? currentDept.description : "";
                  })()}
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
            <div className={styles.row}>
              <FieldWrapper label="Grupo Actual" id="currentGroup">
                <InputText
                  id="currentGroup"
                  name="currentGroup"
                  value={(() => {
                    const currentGroup = groups.find(
                      (g) => g.id === selectedSubgroup.group,
                    );
                    return currentGroup ? currentGroup.description : "";
                  })()}
                  disabled
                />
              </FieldWrapper>
              <FieldWrapper label="Nuevo Grupo" id="newGroup">
                <Select
                  id="newGroup"
                  name="newGroup"
                  value={modifyData.newGroup}
                  onChange={handleModifyChange}
                  required
                  disabled={!modifyData.newDepartment}
                >
                  <option value="">(seleccionar)</option>
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
          </>
        )}

        {showConfirmDialog && (
          <ConfirmationModal
            title="Confirmar Modificación"
            message="¿Está seguro de que desea modificar este subgrupo?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El subgrupo ha sido modificado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
