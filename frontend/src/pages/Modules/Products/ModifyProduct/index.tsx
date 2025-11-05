import styles from "./ModifyProduct.module.css";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import BackButton from "../../../../components/BackButton";
import { useState } from "react";
import { productsAPI, type Product } from "../../../../services/api";

interface ProductFormData {
  code: string;
  description: string;
  brand: string;
  type: string;
  department: string;
  group: string;
  subgroup: string;
}

export default function ModifyProduct() {
  const [currentCode, setCurrentCode] = useState<string>("");
  const [formData, setFormData] = useState<ProductFormData>({
    code: "",
    description: "",
    brand: "",
    type: "",
    department: "",
    group: "",
    subgroup: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [productFound, setProductFound] = useState<boolean>(false);

  const handleCurrentCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCode(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchProduct = async () => {
    if (!currentCode.trim()) {
      setError("Por favor ingrese un código");
      return;
    }

    setSearching(true);
    setError("");

    try {
      // Buscar el producto por código
      const response = await productsAPI.getAll();
      const products: Product[] = response.data;
      const product = products.find(
        (p) => p.code.toLowerCase() === currentCode.trim().toLowerCase()
      );

      if (product) {
        setFormData({
          code: product.code,
          description: product.description,
          brand: product.brand,
          type: product.type,
          department: product.department,
          group: product.group,
          subgroup: product.subgroup,
        });
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
      setError("Primero busque un producto para modificar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Encontrar el ID del producto original
      const response = await productsAPI.getAll();
      const products: Product[] = response.data;
      const originalProduct = products.find(
        (p) => p.code.toLowerCase() === currentCode.trim().toLowerCase()
      );

      if (originalProduct) {
        await productsAPI.update(originalProduct.id!, formData);
        alert("Producto modificado exitosamente!");
        // Limpiar formulario
        setCurrentCode("");
        setFormData({
          code: "",
          description: "",
          brand: "",
          type: "",
          department: "",
          group: "",
          subgroup: "",
        });
        setProductFound(false);
      }
    } catch (error) {
      console.error("Error modificando producto:", error);
      setError("Error al modificar el producto. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCurrentCode("");
    setFormData({
      code: "",
      description: "",
      brand: "",
      type: "",
      department: "",
      group: "",
      subgroup: "",
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
      <h1>Modificar Producto</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton />
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}

        <div className={styles.currentCode}>
          <InputField
            label="Código Actual"
            id="current_code"
            name="current_code"
            value={currentCode}
            onChange={handleCurrentCodeChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            text={searching ? "Buscando..." : "Buscar"}
            onClick={searchProduct}
            disabled={searching}
            style="primary"
          />
        </div>

        {productFound && (
          <>
            <div className={styles.row}>
              <InputField
                label="Código"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
              />
              <InputField
                label="Descripción"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.row}>
              <InputField
                label="Marca"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
              <InputField
                label="Tipo"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.row}>
              <InputField
                label="Departamento"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
              <InputField
                label="Grupo"
                id="group"
                name="group"
                value={formData.group}
                onChange={handleInputChange}
              />
              <InputField
                label="Subgrupo"
                id="subgroup"
                name="subgroup"
                value={formData.subgroup}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.rowButtons}>
              <Button
                text="Limpiar"
                style="secondary"
                className={styles.buttonLimpiar}
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
          </>
        )}
      </form>
    </main>
  );
}
