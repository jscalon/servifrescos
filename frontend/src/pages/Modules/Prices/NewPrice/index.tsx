import styles from "./NewPrice.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import InputNumber from "../../../../components/InputNumber";
import InputDate from "../../../../components/InputDate";
import BackButton from "../../../../components/BackButton";
import { useState } from "react";
import { productsAPI, type Product } from "../../../../services/api";

interface NewPriceFormData {
  productCode: string;
  productDescription: string;
  currentPrice: string;
  newPrice: string;
  effectiveDate: string;
  registrationDate: string;
}

export default function NewPrice() {
  const [formData, setFormData] = useState<NewPriceFormData>({
    productCode: "",
    productDescription: "",
    currentPrice: "",
    newPrice: "",
    effectiveDate: "",
    registrationDate: new Date().toISOString().split("T")[0], // Fecha actual
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [productFound, setProductFound] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchProduct = async () => {
    if (!formData.productCode.trim()) {
      setError("Por favor ingrese un código de producto");
      return;
    }

    setSearching(true);
    setError("");

    try {
      const response = await productsAPI.getAll();
      const products: Product[] = response.data;
      const product = products.find(
        (p) =>
          p.code.toLowerCase() === formData.productCode.trim().toLowerCase()
      );

      if (product) {
        setFormData((prev) => ({
          ...prev,
          productDescription: product.description,
          currentPrice: "0", // Temporal hasta que se implemente la API de precios
        }));
        setProductFound(true);
        setError("");
      } else {
        setError("Producto no encontrado");
        setProductFound(false);
      }
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

    if (!productFound) {
      setError("Primero busque un producto válido");
      return;
    }

    if (!formData.newPrice || !formData.effectiveDate) {
      setError("Por favor complete el nuevo precio y fecha de efectividad");
      return;
    }

    const newPriceNum = parseFloat(formData.newPrice);
    if (isNaN(newPriceNum) || newPriceNum <= 0) {
      setError("El precio debe ser un número positivo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Aquí irá la llamada a la API de precios cuando esté lista
      // await pricesAPI.create({
      //   productId: /* ID del producto encontrado */,
      //   price: newPriceNum,
      //   effectiveDate: formData.effectiveDate,
      // });

      alert("Precio creado exitosamente!");
      setFormData({
        productCode: "",
        productDescription: "",
        currentPrice: "",
        newPrice: "",
        effectiveDate: "",
        registrationDate: new Date().toISOString().split("T")[0],
      });
      setProductFound(false);
    } catch (error) {
      console.error("Error creando precio:", error);
      setError("Error al crear el precio. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      productCode: "",
      productDescription: "",
      currentPrice: "",
      newPrice: "",
      effectiveDate: "",
      registrationDate: new Date().toISOString().split("T")[0],
    });
    setError("");
    setProductFound(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        e.target instanceof HTMLInputElement &&
        e.target.name === "productCode"
      ) {
        searchProduct();
      }
    }
  };

  return (
    <main>
      <h1>Nuevo Precio</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.row}>
          <div className={styles.searchGroup}>
            <FieldWrapper label="Código del Producto" id="productCode">
              <InputText
                id="productCode"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </FieldWrapper>
            {/* <Button
              text={searching ? "Buscando..." : "Buscar"}
              onClick={searchProduct}
              disabled={searching}
              style="primary"
              type="button"
            /> */}
          </div>
          <FieldWrapper
            label="Descripción del Producto"
            id="productDescription"
          >
            <InputText
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              readOnly
            />
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Nuevo Precio ($)" id="newPrice">
            <InputNumber
              id="newPrice"
              name="newPrice"
              step="0.01"
              min="0"
              value={formData.newPrice}
              onChange={handleInputChange}
            />
          </FieldWrapper>
          <FieldWrapper label="Precio Actual ($)" id="currentPrice">
            <InputText
              id="currentPrice"
              name="currentPrice"
              value={formData.currentPrice}
              readOnly
            />
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Fecha de Efectividad" id="effectiveDate">
            <InputDate
              id="effectiveDate"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleInputChange}
            />
          </FieldWrapper>
          <FieldWrapper label="Fecha de Registro" id="registrationDate">
            <InputDate
              id="registrationDate"
              name="registrationDate"
              value={formData.registrationDate}
              readOnly
            />
          </FieldWrapper>
        </div>
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
      </form>
    </main>
  );
}
