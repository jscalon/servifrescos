import styles from "./ModifyStore.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputNumber from "../../../../components/InputNumber";
import Select from "../../../../components/Select";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import { storesAPI, type Store } from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

interface StoreFormData {
  number: string;
  name: string;
  address: string;
}

export default function ModifyStore() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_store")) {
    return (
      <main>
        <h1>Modificar Tienda</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/stores" />
          <div className={styles.error}>
            No tienes permisos para modificar tiendas
          </div>
        </div>
      </main>
    );
  }

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [originalNumber, setOriginalNumber] = useState<number>(0);
  const [formData, setFormData] = useState<StoreFormData>({
    number: "",
    name: "",
    address: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await storesAPI.getAll();
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      const store = stores.find((s) => s.number === parseInt(selectedStore));
      if (store) {
        setFormData({
          number: store.number.toString(),
          name: store.name,
          address: store.address,
        });
        setOriginalNumber(store.number);
      }
    }
  }, [selectedStore, stores]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue =
      name === "number" || name === "name" ? value.toUpperCase() : value;

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
      const newNumber = parseInt(formData.number) || 0;
      const dataToSend: Omit<Store, "id"> = {
        number: newNumber,
        name: formData.name,
        address: formData.address,
      };
      await storesAPI.update(originalNumber, dataToSend);
      setShowSuccessDialog(true);
      // Reset
      setSelectedStore("");
      setOriginalNumber(0);
      setFormData({
        number: "",
        name: "",
        address: "",
      });
    } catch (error: any) {
      console.error("Error modificando tienda:", error);
      if (error.response?.status === 400 && error.response?.data?.number) {
        setError(
          "Error modificando tienda: Ya existe una tienda con ese número.",
        );
      } else {
        setError("Error al modificar la tienda. Inténtalo de nuevo.");
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
    setSelectedStore("");
    setOriginalNumber(0);
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
      <h1>Modificar Tienda</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/stores" />
        {error && <div className={styles.error}>{error}</div>}
        <FieldWrapper label="Seleccionar Tienda" id="selectedStore">
          <Select
            id="selectedStore"
            name="selectedStore"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">Seleccionar tienda</option>
            {stores
              .sort((a, b) => a.number - b.number)
              .map((store) => (
                <option key={store.number} value={store.number.toString()}>
                  {store.number} - {store.name}
                </option>
              ))}
          </Select>
        </FieldWrapper>
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
            style="reset"
            className={styles.buttonReiniciar}
            type="button"
            onClick={handleClear}
          />
          <Button
            text={loading ? "Guardando..." : "Guardar"}
            className={styles.buttonGuardar}
            type="submit"
            disabled={loading || !selectedStore}
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
            message="La tienda ha sido modificada exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
