import styles from "./CreateProduct.module.css";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";

export default function CreateProduct() {
  return (
    <>
      <h1>Crear Producto</h1>
      <Card className={styles.card}>
        <form className={styles.form}>
          <div className={styles.row}>
            <InputField label="Código" id="code" name="code" />
            <InputField
              label="Descripción"
              id="description"
              name="description"
            />
          </div>
          <div className={styles.row}>
            <InputField label="Marca" id="brand" name="brand" />
            <InputField label="Tipo" id="tipe" name="tipe" />
          </div>
          <div className={styles.row}>
            <InputField label="Departamento" id="department" name="department" />
            <InputField label="Grupo" id="group" name="group" />
            <InputField label="Subgrupo" id="subgroup" name="subgroup" />
          </div>
          <div className={styles.row}>
            <Button text="Limpiar" style="secondary" className={styles.buttonLimpiar}/>
            <Button text="Guardar" className={styles.buttonGuardar}/>
          </div>
        </form>
      </Card>
    </>
  );
}
