import styles from "./PriceBar.module.css";
import Button from "../Button";
import InputText from "../InputText";
import BackButton from "../BackButton";

export default function PriceBar() {
  return (
    <div className={styles.priceBar}>
      <BackButton />
      <div className={styles.searchSection}>
        <span className={styles.span}>Buscar: &nbsp;</span>
        <InputText id="1" name="1" className={styles.input} />
      </div>
      <Button text="Nuevo 💲" className={styles.button} />
    </div>
  );
}
