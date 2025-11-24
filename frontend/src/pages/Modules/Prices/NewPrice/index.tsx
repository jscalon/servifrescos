import styles from "./NewPrice.module.css";
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
  storesAPI,
  pricesAPI,
  type Store,
} from "../../../../services/api";

interface PriceFormData {
  product: string;
  store: string;
  price: string;
  effective_date: string;
  comment: string;
  product_description: string;
  type: string;
}

export default function NewPrice() {
  const [productCode, setProductCode] = useState<string>("");
  const [store, setStore] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState<PriceFormData>({
    product: "",
    store: "",
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
        const res = await storesAPI.getAll();
        setStores(res.data);
      } catch (error) {
        // Error al cargar las tiendas
      }
    };
    fetchStores();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "productCode") {
      setProductCode(value);
    } else if (name === "store") {
      setStore(value);
      const storeObj = stores.find((s) => s.name === value);
      setSelectedStore(storeObj || null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const searchProduct = async () => {
    if (!productCode.trim()) {
      setError("Por favor ingrese el código del producto");
      return;
    }
    if (!selectedStore) {
      setError("Por favor seleccione una tienda");
      return;
    }

    setSearching(true);
    setError("");

    try {
      const productsRes = await productsAPI.getAll();
      const product = productsRes.data.find(
        (p) => p.code.toLowerCase() === productCode.trim().toLowerCase()
      );

      if (!product) {
        setError("Producto no encontrado");
        setProductFound(false);
        return;
      }

      const pricesRes = await pricesAPI.priceHistory(
        product.code,
        selectedStore.number
      );
      const prices = pricesRes.data;
      const lastPrice = prices.length > 0 ? prices[0] : null;

      setFormData({
        product: product.code,
        store: selectedStore.number,
        price: lastPrice ? lastPrice.price : "",
        effective_date: lastPrice ? lastPrice.effective_date : "",
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
      formData.product === "" ||
      formData.store === "" ||
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
      setError("Error al crear el precio");
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
      product: "",
      store: "",
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
      <h1>Nuevo Precio</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/prices" />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.firstRow}>
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
          <FieldWrapper label="Tienda" id="store" className={styles.code}>
            <Select
              id="store"
              name="store"
              value={store}
              onChange={handleInputChange}
              disabled={productFound}
            >
              <option value="">Seleccionar tienda</option>
              {stores.map((s) => (
                <option key={s.number} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          {!productFound && (
            <Button
              text={searching ? "Buscando..." : "Buscar"}
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
                style="secondary"
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
