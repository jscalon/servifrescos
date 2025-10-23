import styles from "./QueryBar.module.css";
import Button from "../Button";
import InputText from "../InputText";

export default function QueryBar() {
  return (
    <div className={styles.queryBar}>
      <span className={styles.span}>Criterio de búsqueda:</span>
			<select name="a" id="">
				<option value="">Código</option>
				<option value="">Descripción</option>
				<option value="">Marca</option>
				<option value="">Tipo</option>
				<option value="">Departamento</option>
				<option value="">Grupo</option>
				<option value="">Subgrupo</option>
			</select>
			<InputText id="1" name="1" className={styles.input}/>
			<Button text="Buscar"/>
    </div>
  );
}
