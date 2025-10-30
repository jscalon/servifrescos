import styles from "./NewPrice.module.css";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import BackButton from "../../../../components/BackButton";

export default function NewPrice() {
  return (
    <main>
      <h1>Nuevo Precio</h1>
      <form className={`card ${styles.form}`}>
        <BackButton />
        <div className={styles.row}>
          <InputField label="Código del Producto" id="code" name="code" />
          <InputField
            label="Descripción del Producto"
            id="description"
            name="description"
            readOnly
          />
        </div>
        <div className={styles.row}>
          <InputField label="Nuevo Precio ($)" id="brand" name="brand" />
          <InputField
            label="Precio Actual ($)"
            id="tipe"
            name="tipe"
            readOnly
          />
        </div>
        <div className={styles.row}>
          <InputField
            label="Fecha de Efectividad"
            id="department"
            name="department"
          />
          <InputField
            label="Fecha de Registro"
            id="group"
            name="group"
            readOnly
          />
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
