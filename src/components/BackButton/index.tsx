import styles from "./BackButton.module.css";
import { useNavigate } from "react-router-dom";
import { BackArrowIcon } from "../Icons";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button className={styles.backButton} onClick={() => navigate(-1)}>
      <BackArrowIcon/>
    </button>
  );
}
