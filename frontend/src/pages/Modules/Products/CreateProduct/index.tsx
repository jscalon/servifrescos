import styles from "./CreateProduct.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import Select from "../../../../components/Select";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convertir code y description a mayúsculas
    const processedValue = (name === 'code' || name === 'description') ? value.toUpperCase() : value;
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await productsAPI.create(formData);
      // Reiniciar formulario después de guardar exitosamente
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
        {error && <div className={styles.error}>{error}</div>}
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
            <Select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar marca</option>
              <option value="CENTENARIO">CENTENARIO</option>
              <option value="COCA COLA">COCA COLA</option>
              <option value="DEL CORRAL">DEL CORRAL</option>
              <option value="DON MIGUEL">DON MIGUEL</option>
              <option value="KEMPIS">KEMPIS</option>
              <option value="NEVADA">NEVADA</option>
              <option value="PALMIZULIA">PALMIZULIA</option>
              <option value="PASTOR">PASTOR</option>
              <option value="SUR DEL LAGO">SUR DEL LAGO</option>
              <option value="UPACA">UPACA</option>
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Tipo" id="type">
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar tipo</option>
              <option value="PESABLE">PESABLE</option>
              <option value="UNIDADES">UNIDADES</option>
            </Select>
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
      </form>
    </main>
  );
}
