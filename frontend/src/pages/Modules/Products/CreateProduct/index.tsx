import styles from "./CreateProduct.module.css";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import BackButton from "../../../../components/BackButton";
import { useState } from "react";
import { productsAPI } from "../../../../services/api";

interface ProductFormData {
  code: string;
  description: string;
  brand: string;
  type: string;
  department: string;
  group: string;
  subgroup: string;
}

export default function CreateProduct() {
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
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await productsAPI.create(formData);
      // Limpiar formulario después de guardar exitosamente
      setFormData({
        code: "",
        description: "",
        brand: "",
        type: "",
        department: "",
        group: "",
        subgroup: "",
      });
      alert("Producto creado exitosamente!");
    } catch (error) {
      console.error("Error creando producto:", error);
      setError("Error al crear el producto. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
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
  };

  return (
    <main>
      <h1>Crear Producto</h1>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <BackButton />
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
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
      </form>
    </main>
  );
}
