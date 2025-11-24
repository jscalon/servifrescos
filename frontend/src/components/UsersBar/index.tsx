import styles from "./UsersBar.module.css";
import Button from "../Button";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useNavigate } from "react-router-dom";

export default function UsersBar() {
  const navigate = useNavigate();
  return (
    <div className={styles.usersBar}>
      <BackButton to="/modules" />
      <div className={styles.searchSection}>
        <span className={styles.span}>Buscar: &nbsp;</span>
        <InputText id="1" name="1" className={styles.input} />
      </div>
      <Button
        text="Nuevo +👤"
        className={styles.button}
        onClick={() => navigate("new")}
      />
    </div>
  );
}
