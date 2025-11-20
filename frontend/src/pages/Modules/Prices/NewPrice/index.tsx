import styles from "./NewPrice.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputNumber from "../../../../components/InputNumber";
import Select from "../../../../components/Select";
import InputDateTime from "../../../../components/InputDateTime";
import BackButton from "../../../../components/BackButton";
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
  comentary: string;
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
    comentary: "",
    product_description: "",
    type: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [productFound, setProductFound] = useState<boolean>(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storesAPI.getAll();
        setStores(res.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
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
        comentary: "",
        product_description: product.description,
        type: product.type,
      });
      setProductFound(true);
    } catch (error) {
      console.error("Error buscando producto:", error);
      setError("Error al buscar el producto");
      setProductFound(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        comentary: formData.comentary,
      };
      await pricesAPI.create(dataToSend);
      handleReset();
    } catch (error: any) {
      console.error("Error creando precio:", error);
      console.error("Detalles del error:", error.response?.data);
      setError(
        "Error al crear el precio: " +
          (error.response?.data?.detail || "Ver consola para detalles")
      );
    } finally {
      setLoading(false);
    }
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
      comentary: "",
      product_description: "",
      type: "",
    });
    setError("");
    setProductFound(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchProduct();
    }
  };

  return (
    <main>
      <h1>Nuevo Precio</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <FieldWrapper label="Código del producto" id="productCode">
            <InputText
              id="productCode"
              name="productCode"
              value={productCode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={productFound}
            />
          </FieldWrapper>
          <FieldWrapper label="Tienda" id="store">
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
          <Button
            text={searching ? "Buscando..." : "Buscar"}
            onClick={searchProduct}
            disabled={searching || productFound}
            style="primary"
            type="button"
          />
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
                  readOnly
                />
              </FieldWrapper>
              <FieldWrapper label="Tipo de producto" id="type">
                <InputText
                  id="type"
                  name="type"
                  value={formData.type}
                  readOnly
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
            <FieldWrapper label="Comentario" id="comentary">
              <InputText
                id="comentary"
                name="comentary"
                value={formData.comentary}
                onChange={handleInputChange}
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
      </form>
    </main>
  );
}
