import styles from "./BackButton.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { BackArrowIcon } from "../Icons";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const show = !["/login", "/modules", "/notfound"].includes(
    location.pathname
  );

  if (!show) return null;

  return (
    <button className={styles.backButton} onClick={() => navigate(-1)}>
      <BackArrowIcon />
    </button>
  );
}
