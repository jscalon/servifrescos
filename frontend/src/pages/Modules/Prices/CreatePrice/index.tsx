import styles from "./CreatePrice.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputNumber from "../../../../components/InputNumber";
import Select from "../../../../components/Select";
import InputDateTime from "../../../../components/InputDateTime";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import {
  productsAPI,
  myStoresAPI,
  pricesAPI,
  type Store,
} from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

interface PriceFormData {
  product: number;
  store: number;
  price: string;
  effective_date: string;
  comment: string;
  product_description: string;
  type: string;
}

export default function CreatePrice() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_price")) {
    return (
      <main>
        <h1>Crear Precio</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/prices" refresh={true} />
          <div className={styles.error}>
            No tienes permisos para crear precios
          </div>
        </div>
      </main>
    );
  }

  const [productCode, setProductCode] = useState<string>("");
  const [store, setStore] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState<PriceFormData>({
    product: 0,
    store: 0,
    price: "",
    effective_date: "",
    comment: "",
    product_description: "",
    type: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [productFound, setProductFound] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await myStoresAPI.getMyStores();
        setStores(res.data);
      } catch (error) {
        console.error("Error loading stores:", error);
        setStores([]);
      }
    };
    fetchStores();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "productCode") {
      setProductCode(value.toUpperCase());
    } else if (name === "store") {
      setStore(value);
      const storeObj = stores.find((s) => s.name === value);
      setSelectedStore(storeObj || null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const searchProduct = async () => {
    if (!selectedStore) {
      setError("Por favor seleccione una tienda");
      return;
    }
    if (!productCode.trim()) {
      setError("Por favor ingrese el código del producto");
      return;
    }

    setSearching(true);
    setError("");

    try {
      const productsRes = await productsAPI.getAll();
      const product = productsRes.data.find(
        (p) => p.code.toLowerCase() === productCode.trim().toLowerCase(),
      );

      if (!product) {
        setError("Producto no encontrado");
        setProductFound(false);
        return;
      }

      setFormData({
        product: product.id,
        store: selectedStore.id,
        price: "",
        effective_date: "",
        comment: "",
        product_description: product.description,
        type: product.type,
      });
      setProductFound(true);
    } catch (error) {
      setError("Error al buscar el producto");
      setProductFound(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");

    if (
      formData.product === 0 ||
      formData.store === 0 ||
      formData.price.trim() === "" ||
      formData.effective_date === ""
    ) {
      setError("Todos los campos requeridos deben estar llenos");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        product: formData.product,
        store: formData.store,
        price: formData.price,
        effective_date: formData.effective_date.includes(":")
          ? formData.effective_date + ":00"
          : formData.effective_date,
        comment: formData.comment,
      };
      await pricesAPI.create(dataToSend);
      setShowSuccessDialog(true);
      handleReset();
    } catch (error: any) {
      // Verificar si hay errores específicos por campo
      if (error.response?.data?.price) {
        // Error específico del campo precio
        const priceError = error.response.data.price;
        setError(Array.isArray(priceError) ? priceError[0] : priceError);
      } else if (error.response?.data?.detail) {
        // Error general
        setError(error.response.data.detail);
      } else if (typeof error.response?.data === "object") {
        // Errores de múltiples campos - tomar el primer error
        const firstError = Object.values(error.response.data)[0];
        setError(
          Array.isArray(firstError) ? firstError[0] : String(firstError),
        );
      } else {
        setError(
          "Error al crear el precio. Verifica que los datos sean correctos.",
        );
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

  const handleReset = () => {
    setProductCode("");
    setStore("");
    setSelectedStore(null);
    setFormData({
      product: 0,
      store: 0,
      price: "",
      effective_date: "",
      comment: "",
      product_description: "",
      type: "",
    });
    setError("");
    setProductFound(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (!productFound) {
        searchProduct();
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
      handleReset();
    }
  };

  return (
    <main>
      <h1>Crear Precio</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/prices" refresh={true} />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.firstRow}>
          <FieldWrapper label="Tienda" id="store" className={styles.code}>
            <Select
              id="store"
              name="store"
              value={store}
              onChange={handleInputChange}
              disabled={productFound}
            >
              <option value="">(seleccionar)</option>
              {stores
                .sort((a, b) => a.number - b.number)
                .map((s) => (
                  <option key={s.number} value={s.name}>
                    {s.name}
                  </option>
                ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper
            label="Código del producto"
            id="productCode"
            className={styles.code}
          >
            <InputText
              id="productCode"
              name="productCode"
              value={productCode}
              onChange={handleInputChange}
              disabled={productFound}
            />
          </FieldWrapper>
          {!productFound && (
            <Button
              text={searching ? "Cargando..." : "Aceptar"}
              onClick={searchProduct}
              disabled={searching}
              style="primary"
              type="button"
            />
          )}
        </div>

        {productFound && (
          <>
            <div className={styles.row}>
              <FieldWrapper
                label="Descripción del producto"
                id="productDescription"
              >
                <InputText
                  id="productDescription"
                  name="productDescription"
                  value={formData.product_description}
                  disabled
                />
              </FieldWrapper>
              <FieldWrapper label="Tipo de producto" id="type">
                <InputText
                  id="type"
                  name="type"
                  value={formData.type}
                  disabled
                />
              </FieldWrapper>
            </div>
            <div className={styles.row}>
              <FieldWrapper label="Precio ($)" id="price">
                <InputNumber
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </FieldWrapper>
              <FieldWrapper label="Fecha de efectividad" id="effective_date">
                <InputDateTime
                  id="effective_date"
                  name="effective_date"
                  value={formData.effective_date}
                  onChange={handleInputChange}
                  required
                />
              </FieldWrapper>
            </div>
            <FieldWrapper label="Comentario" id="comment">
              <InputText
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required={false}
              />
            </FieldWrapper>
            <div className={styles.rowButtons}>
              <Button
                text="Reiniciar"
                style="reset"
                className={styles.buttonReiniciar}
                type="button"
                onClick={handleReset}
              />
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
            title="Confirmar Guardado"
            message="¿Está seguro de que desea guardar este precio?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}
        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El precio ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
