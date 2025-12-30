import styles from "./CreateProduct.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import Select from "../../../../components/Select";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState } from "react";
import { productsAPI } from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

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
  const { hasPermission } = usePermissions();

  if (!hasPermission("add_product")) {
    return (
      <main>
        <h1>Crear Producto</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/products" />
          <div className={styles.error}>
            No tienes permisos para crear productos
          </div>
        </div>
      </main>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");

    try {
      await productsAPI.create(formData);
      // Mostrar modal de éxito en lugar de alert
      setShowSuccessDialog(true);
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
    } catch (error: any) {
      console.error("Error creando producto:", error);

      // Verificar si es un error de código duplicado
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError(
          "Error creando producto: Ya existe un producto con ese código."
        );
      } else {
        setError("Error al crear el producto. Inténtalo de nuevo.");
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

  // Manejador de teclas para atajos de teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !loading) {
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

  return (
    <main>
      <h1>Crear Producto</h1>
      <form
        className={`card ${styles.form}`}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <BackButton to="/modules/products" />
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
            title="Confirmar Guardado"
            message="¿Está seguro de que desea guardar este producto?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
          />
        )}

        {/* Modal de éxito reutilizable */}
        {showSuccessDialog && (
          <SuccessModal
            title="¡Operación Exitosa!"
            message="El producto ha sido creado exitosamente."
            onAccept={handleAcceptSuccess}
          />
        )}
      </form>
    </main>
  );
}
