import styles from "./ModifyProduct.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
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
  const [productCode, setProductCode] = useState<string>("");
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
        setProductCode(product.code);
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
    if (!productCode) {
      setError("Primero busque un producto para modificar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Si el código cambió, necesitamos crear un nuevo producto y eliminar el antiguo
      if (formData.code !== productCode) {
        // Crear nuevo producto con el código actualizado
        await productsAPI.create(formData);
        // Eliminar el producto antiguo
        await productsAPI.delete(productCode);
        alert("Producto modificado exitosamente! (Código actualizado)");
      } else {
        // Actualización normal sin cambiar código
        await productsAPI.update(productCode, formData);
        alert("Producto modificado exitosamente!");
      }

      // Reiniciar formulario
      setCurrentCode("");
      setProductCode("");
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
    } catch (error) {
      console.error("Error modificando producto:", error);
      setError("Error al modificar el producto. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCurrentCode("");
    setProductCode("");
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
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.currentCode}>
          <FieldWrapper label="Código Actual" id="current_code">
            <InputText
              id="current_code"
              name="current_code"
              value={currentCode}
              onChange={handleCurrentCodeChange}
              onKeyDown={handleKeyDown}
              disabled={productFound} // Bloquear después de buscar
            />
          </FieldWrapper>
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
              <FieldWrapper label="Código" id="code">
                <InputText
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
              <FieldWrapper label="Descripción" id="description">
                <InputText
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
            </div>
            <div className={styles.row}>
              <FieldWrapper label="Marca" id="brand">
                <InputText
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
              <FieldWrapper label="Tipo" id="type">
                <InputText
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
            </div>
            <div className={styles.row}>
              <FieldWrapper label="Departamento" id="department">
                <InputText
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
              <FieldWrapper label="Grupo" id="group">
                <InputText
                  id="group"
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                />
              </FieldWrapper>
              <FieldWrapper label="Subgrupo" id="subgroup">
                <InputText
                  id="subgroup"
                  name="subgroup"
                  value={formData.subgroup}
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
          </>
        )}
      </form>
    </main>
  );
}
