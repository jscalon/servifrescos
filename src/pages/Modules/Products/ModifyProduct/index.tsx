import styles from "./ModifyProduct.module.css";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import BackButton from "../../../../components/BackButton";

export default function ModifyProduct() {
  return (
    <main>
      <h1>Modificar Producto</h1>
      <form className={`card ${styles.form}`}>
				<BackButton/>
        <div className={styles.row}>
          <InputField label="Código" id="code" name="code" />
          <InputField label="Descripción" id="description" name="description" />
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
        <div className={styles.rowButtons}>
          <Button
            text="Limpiar"
            style="secondary"
            className={styles.buttonLimpiar}
          />
          <Button text="Guardar" className={styles.buttonGuardar} />
        </div>
      </form>
    </main>
  );
}
