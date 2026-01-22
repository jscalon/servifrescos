import styles from "./CreateProduct.module.css";
import Button from "../../../../components/Button";
import FieldWrapper from "../../../../components/FieldWrapper";
import InputText from "../../../../components/InputText";
import Select from "../../../../components/Select";
import BackButton from "../../../../components/BackButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import { useState, useEffect } from "react";
import {
  productsAPI,
  categoriesAPI,
  type Brand,
  type ProductType,
  type Department,
  type Group,
  type Subgroup,
} from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

interface ProductFormData {
  code: string;
  description: string;
  brand: number;
  type: number;
  subgroup: number;
}

export default function CreateProduct() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_product")) {
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
    brand: 0,
    type: 0,
    subgroup: 0,
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  // Estados para opciones dinámicas
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true);

  // Cargar opciones al montar el componente
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [brandsRes, typesRes, deptsRes, groupsRes, subgroupsRes] =
          await Promise.all([
            categoriesAPI.brands.getAll(),
            categoriesAPI.productTypes.getAll(),
            categoriesAPI.departments.getAll(),
            categoriesAPI.groups.getAll(),
            categoriesAPI.subgroups.getAll(),
          ]);
        setBrands(brandsRes.data);
        setProductTypes(typesRes.data);
        setDepartments(deptsRes.data);
        setGroups(groupsRes.data);
        setSubgroups(subgroupsRes.data);
      } catch (error) {
        console.error("Error cargando opciones:", error);
        setError("Error al cargar las opciones. Inténtalo de nuevo.");
      } finally {
        setOptionsLoading(false);
      }
    };
    loadOptions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    // Convertir code y description a mayúsculas
    const processedValue =
      name === "code" || name === "description" ? value.toUpperCase() : value;

    if (name === "department") {
      setSelectedDepartment(value);
      setSelectedGroup("");
      setFormData((prev) => ({ ...prev, subgroup: 0 }));
    } else if (name === "group") {
      setSelectedGroup(value);
      setFormData((prev) => ({ ...prev, subgroup: 0 }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "brand" || name === "type" || name === "subgroup"
            ? Number(value)
            : processedValue,
      }));
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

    try {
      await productsAPI.create(formData);
      // Mostrar modal de éxito en lugar de alert
      setShowSuccessDialog(true);
      // Reiniciar formulario después de guardar exitosamente
      setFormData({
        code: "",
        description: "",
        brand: 0,
        type: 0,
        subgroup: 0,
      });
      setSelectedDepartment("");
      setSelectedGroup("");
    } catch (error: any) {
      console.error("Error creando producto:", error);

      // Verificar si es un error de código duplicado
      if (error.response?.status === 400 && error.response?.data?.code) {
        setError(
          "Error creando producto: Ya existe un producto con ese código.",
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
      brand: 0,
      type: 0,
      subgroup: 0,
    });
    setSelectedDepartment("");
    setSelectedGroup("");
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
              value={formData.brand ? formData.brand.toString() : ""}
              onChange={handleInputChange}
              disabled={optionsLoading}
            >
              <option value="">(seleccionar)</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Tipo" id="type">
            <Select
              id="type"
              name="type"
              value={formData.type ? formData.type.toString() : ""}
              onChange={handleInputChange}
              disabled={optionsLoading}
            >
              <option value="">(seleccionar)</option>
              {productTypes.map((type) => (
                <option key={type.id} value={type.id.toString()}>
                  {type.name}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        </div>
        <div className={styles.row}>
          <FieldWrapper label="Departamento" id="department">
            <Select
              id="department"
              name="department"
              value={selectedDepartment}
              onChange={handleInputChange}
              disabled={optionsLoading}
            >
              <option value="">(seleccionar)</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.code}>
                  {dept.description}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Grupo" id="group">
            <Select
              id="group"
              name="group"
              value={selectedGroup}
              onChange={handleInputChange}
              disabled={!selectedDepartment || optionsLoading}
            >
              <option value="">(seleccionar)</option>
              {groups
                .filter((group) => {
                  const dept = departments.find(
                    (d) => d.code === selectedDepartment,
                  );
                  return dept && group.department === dept.id;
                })
                .map((group) => (
                  <option key={group.id} value={group.code}>
                    {group.description}
                  </option>
                ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Subgrupo" id="subgroup">
            <Select
              id="subgroup"
              name="subgroup"
              value={formData.subgroup ? formData.subgroup.toString() : ""}
              onChange={handleInputChange}
              disabled={!selectedGroup || optionsLoading}
            >
              <option value="">(seleccionar)</option>
              {subgroups
                .filter((subgroup) => {
                  const group = groups.find((g) => g.code === selectedGroup);
                  return group && subgroup.group === group.id;
                })
                .map((subgroup) => (
                  <option key={subgroup.id} value={subgroup.id.toString()}>
                    {subgroup.description}
                  </option>
                ))}
            </Select>
          </FieldWrapper>
        </div>
        <div className={styles.rowButtons}>
          <Button
            text="Reiniciar"
            style="reset"
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
