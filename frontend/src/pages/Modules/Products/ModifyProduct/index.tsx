import styles from "./ModifyProduct.module.css";
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
  type Product,
} from "../../../../services/api";
import { usePermissions } from "../../../../contexts";

interface ProductFormData {
  code: string;
  description: string;
  brand: number;
  type: number;
  subgroup: number;
}

export default function ModifyProduct() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("manage_product")) {
    return (
      <main>
        <h1>Modificar Producto</h1>
        <div className={`card ${styles.form}`}>
          <BackButton to="/modules/products" />
          <div className={styles.error}>
            No tienes permisos para modificar productos
          </div>
        </div>
      </main>
    );
  }

  const [currentCode, setCurrentCode] = useState<string>("");
  const [productCode, setProductCode] = useState<string>("");
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
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [productFound, setProductFound] = useState<boolean>(false);
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

  const handleCurrentCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCode(e.target.value);
  };

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
        (p) => p.code.toLowerCase() === currentCode.trim().toLowerCase(),
      );

      if (product) {
        // Mapear nombres a IDs
        const brandObj = brands.find((b) => b.name === product.brand);
        const typeObj = productTypes.find((t) => t.name === product.type);
        const subgroupObj = subgroups.find(
          (s) => s.description === product.subgroup,
        );
        const groupObj = groups.find((g) => g.description === product.group);
        const deptObj = departments.find(
          (d) => d.description === product.department,
        );

        setFormData({
          code: product.code,
          description: product.description,
          brand: brandObj ? brandObj.id : 0,
          type: typeObj ? typeObj.id : 0,
          subgroup: subgroupObj ? subgroupObj.id : 0,
        });
        setSelectedDepartment(deptObj ? deptObj.code : "");
        setSelectedGroup(groupObj ? groupObj.code : "");
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
      await productsAPI.update(productCode, formData);
      setShowSuccessDialog(true);

      // Reiniciar formulario
      setCurrentCode("");
      setProductCode("");
      setFormData({
        code: "",
        description: "",
        brand: 0,
        type: 0,
        subgroup: 0,
      });
      setSelectedDepartment("");
      setSelectedGroup("");
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
      brand: 0,
      type: 0,
      subgroup: 0,
    });
    setSelectedDepartment("");
    setSelectedGroup("");
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
        <BackButton to="/modules/products" />
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
              text={searching ? "Cargando..." : "Aceptar"}
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
                      const group = groups.find(
                        (g) => g.code === selectedGroup,
                      );
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
