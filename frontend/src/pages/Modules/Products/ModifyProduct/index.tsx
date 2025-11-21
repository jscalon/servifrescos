import styles from "./ModifyProduct.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import Select from "../../../../components/Select";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
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
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  // Opciones dinámicas basadas en selecciones
  const getGroupOptions = (department: string) => {
    switch (department) {
      case "CONGELADOS":
        return ["CONGELADOS", "HELADOS"];
      case "REFRIGERADOS":
        return ["AVES BENEFICIADAS", "EMBUTIDOS", "CARNE", "LACTEOS"];
      case "SECOS":
        return ["ALIMENTOS PARA MASCOTAS"];
      default:
        return [];
    }
  };

  const getSubgroupOptions = (group: string) => {
    switch (group) {
      case "CONGELADOS":
        return [
          "NUGGETS",
          "MILANESAS",
          "TENDERS",
          "PALITOS",
          "HAMBURGUESAS",
          "ALAS",
        ];
      case "HELADOS":
        return ["HELADOS"];
      case "AVES BENEFICIADAS":
        return [
          "ENTEROS",
          "DESPRESADOS",
          "DESHUESADOS",
          "MENUDOS",
          "RESIDUALES",
        ];
      case "EMBUTIDOS":
        return ["SALCHICHAS", "JAMONES", "MORTADELAS"];
      case "CARNE":
        return ["CARNE BOVINA"];
      case "LACTEOS":
        return [
          "LECHE",
          "QUESOS",
          "YOGURT",
          "MANTEQUILLA",
          "JUGOS",
          "CHICHA",
          "CHOCO",
          "LACTOVISOY",
        ];
      case "ALIMENTOS PARA MASCOTAS":
        return ["PROTICAN", "PROTICAT"];
      default:
        return [];
    }
  };

  const handleCurrentCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCode(e.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Convertir code y description a mayúsculas
    const processedValue =
      name === "code" || name === "description" ? value.toUpperCase() : value;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: processedValue,
      };

      // Resetear campos dependientes cuando cambie el departamento
      if (name === "department") {
        newData.group = "";
        newData.subgroup = "";
      }

      // Resetear subgrupo cuando cambie el grupo
      if (name === "group") {
        newData.subgroup = "";
      }

      return newData;
    });
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

    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");

    try {
      // Si el código cambió, necesitamos crear un nuevo producto y eliminar el antiguo
      if (formData.code !== productCode) {
        // Crear nuevo producto con el código actualizado
        await productsAPI.create(formData);
        // Eliminar el producto antiguo
        await productsAPI.delete(productCode);
      } else {
        // Actualización normal sin cambiar código
        await productsAPI.update(productCode, formData);
      }
      setShowSuccessDialog(true);

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

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

  const handleAcceptSuccess = () => {
    setShowSuccessDialog(false);
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

  // Manejador de teclas para atajos de teclado en el formulario de modificación
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading && productFound) {
      e.preventDefault();
      // Verificar que el formulario sea válido antes de enviar
      const form = e.currentTarget;
      if (form.checkValidity()) {
        handleSubmit(e);
      } else {
        // Si no es válido, mostrar errores de validación del navegador
        form.reportValidity();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
    }
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
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
      >
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
          {!productFound && (
            <Button
              text={searching ? "Buscando..." : "Buscar"}
              onClick={searchProduct}
              disabled={searching}
              style="primary"
            />
          )}
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
                <Select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar departamento</option>
                  <option value="CONGELADOS">CONGELADOS</option>
                  <option value="REFRIGERADOS">REFRIGERADOS</option>
                  <option value="SECOS">SECOS</option>
                </Select>
              </FieldWrapper>
              <FieldWrapper label="Grupo" id="group">
                <Select
                  id="group"
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                  disabled={!formData.department}
                >
                  <option value="">Seleccionar grupo</option>
                  {getGroupOptions(formData.department).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FieldWrapper>
              <FieldWrapper label="Subgrupo" id="subgroup">
                <Select
                  id="subgroup"
                  name="subgroup"
                  value={formData.subgroup}
                  onChange={handleInputChange}
                  disabled={!formData.group}
                >
                  <option value="">Seleccionar subgrupo</option>
                  {getSubgroupOptions(formData.group).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
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

            {/* Modal de confirmación reutilizable */}
            {showConfirmDialog && (
              <ConfirmationModal
                title="Confirmar Modificación"
                message="¿Está seguro de que desea modificar este producto?"
                onConfirm={handleConfirmSave}
                onCancel={handleCancelSave}
              />
            )}
          </>
        )}

        {/* Modal de éxito reutilizable - Fuera del bloque productFound */}
        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El producto ha sido modificado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
