import styles from "./NewUser.module.css";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import BackButton from "../../../../components/BackButton";

export default function NewUser() {
  return (
    <main>
      <h1>Nuevo Usuario</h1>
      <form className={`card ${styles.form}`}>
        <BackButton />
        <div className={styles.row}>
          <InputField label="Nombre de Usuario" id="code" name="code" />
          <InputField label="Roles" id="description" name="description" />
        </div>
        <div className={styles.row}>
          <InputField label="Contraseña" id="brand" name="brand" />
          <InputField label="Confirmar Contraseña" id="tipe" name="tipe" />
        </div>
        <div className={styles.row}>
          <InputField label="Primer Nombre" id="department" name="department" />
          <InputField label="Segundo Nombre" id="group" name="group" />
        </div>
        <div className={styles.row}>
          <InputField
            label="Primer Apellido"
            id="department"
            name="department"
          />
          <InputField label="Segundo Apellido" id="group" name="group" />
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
