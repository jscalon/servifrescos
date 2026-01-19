import styles from "./ModifyProductType.module.css";
import Button from "../../../../../components/Button";
import FieldWrapper from "../../../../../components/FieldWrapper";
import InputText from "../../../../../components/InputText";
import BackButton from "../../../../../components/BackButton";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesAPI, type ProductType } from "../../../../../services/api";
import { usePermissions } from "../../../../../contexts";

interface SearchFormData {
  name: string;
}

interface ModifyFormData {
  newName: string;
}

export default function ModifyProductType() {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Placeholder permission
  if (!hasPermission("manage_category")) {
    return (
      <main>
        <h1>Modificar Tipo de Producto</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/categories/product-types" />
          <div className={styles.error}>
            No tienes permisos para modificar tipos de producto
          </div>
        </div>
      </main>
    );
  }

  const [searchData, setSearchData] = useState<SearchFormData>({ name: "" });
  const [modifyData, setModifyData] = useState<ModifyFormData>({ newName: "" });
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchData({ name: value.toUpperCase() });
  };

  const handleModifyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setModifyData({ newName: value.toUpperCase() });
  };

  const handleSearch = async () => {
    if (!searchData.name.trim()) {
      setError("Ingrese el nombre del tipo de producto a buscar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Since API doesn't have search by name, fetch all and find
      const response = await categoriesAPI.productTypes.getAll();
      const productType = response.data.find(
        (pt) => pt.name.toLowerCase() === searchData.name.toLowerCase(),
      );
      if (productType) {
        setSelectedProductType(productType);
        setModifyData({ newName: productType.name });
      } else {
        setError("Tipo de producto no encontrado.");
      }
    } catch (error) {
      console.error("Error buscando tipo de producto:", error);
      setError("Error al buscar el tipo de producto.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductType) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    if (!selectedProductType) return;
    setLoading(true);
    setError("");

    try {
      await categoriesAPI.productTypes.update(selectedProductType.id, {
        name: modifyData.newName,
      });
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error modificando tipo de producto:", error);
      if (error.response?.status === 400 && error.response?.data?.name) {
        setError(
          "Error modificando tipo de producto: Ya existe un tipo de producto con ese nombre.",
        );
      } else {
        setError("Error al modificar el tipo de producto. Inténtalo de nuevo.");
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
    navigate("/modules/categories/product-types");
  };

  const handleClear = () => {
    setSearchData({ name: "" });
    setModifyData({ newName: "" });
    setSelectedProductType(null);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (!selectedProductType) {
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
      <h1>Modificar Tipo de Producto</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/categories/product-types" />
        {error && <div className={styles.error}>{error}</div>}

        {!selectedProductType ? (
          <div className={styles.searchRow}>
            <FieldWrapper label="Nombre del Tipo de Producto" id="searchName">
              <InputText
                id="searchName"
                name="searchName"
                value={searchData.name}
                onChange={handleSearchChange}
                placeholder="Ingrese el nombre del tipo de producto a modificar"
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
              <FieldWrapper label="Nombre Actual" id="currentName">
                <InputText
                  id="currentName"
                  name="currentName"
                  value={selectedProductType.name}
                  disabled
                />
              </FieldWrapper>
              <FieldWrapper label="Nuevo Nombre" id="newName">
                <InputText
                  id="newName"
                  name="newName"
                  value={modifyData.newName}
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
            message="¿Está seguro de que desea modificar este tipo de producto?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El tipo de producto ha sido modificado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}