import styles from "./CreateStore.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputNumber from "../../../../components/InputNumber";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState } from "react";
import { storesAPI, type Store } from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

interface StoreFormData {
  number: string;
  name: string;
  address: string;
}

export default function CreateStore() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_store")) {
    return (
      <main>
        <h1>Crear Tienda</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/stores" />
          <div className={styles.error}>
            No tienes permisos para crear tiendas
          </div>
        </div>
      </main>
    );
  }

  const [formData, setFormData] = useState<StoreFormData>({
    number: "",
    name: "",
    address: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "number" || name === "name") {
      processedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
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
      const dataToSend: Omit<Store, 'id'> = {
        number: parseInt(formData.number) || 0,
        name: formData.name,
        address: formData.address,
      };
      await storesAPI.create(dataToSend);
      setShowSuccessDialog(true);
      setFormData({
        number: "",
        name: "",
        address: "",
      });
    } catch (error: any) {
      console.error("Error creando tienda:", error);

      if (error.response?.status === 400 && error.response?.data?.number) {
        setError("Error creando tienda: Ya existe una tienda con ese número.");
      } else {
        setError("Error al crear la tienda. Inténtalo de nuevo.");
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
    setFormData({
      number: "",
      name: "",
      address: "",
    });
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
      <h1>Crear Tienda</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/stores" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Número" id="number">
            <InputNumber
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
            />
          </FieldWrapper>
          <FieldWrapper label="Nombre" id="name">
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Dirección" id="address">
            <InputText
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FieldWrapper>
        </div>
        <div className={styles.rowButtons}>
          <Button
            text="Reiniciar"
            style="secondary"
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

        {showConfirmDialog && (
          <ConfirmationModal
            title="Confirmar Guardado"
            message="¿Está seguro de que desea guardar esta tienda?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="La tienda ha sido creada exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
