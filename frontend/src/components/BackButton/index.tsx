import styles from "./BackButton.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { BackArrowIcon } from "../Icons";

interface BackButtonProps {
  to?: string;
}

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const show = !["/login", "/modules"].includes(location.pathname);

  if (!show) return null;

  return (
    <button
      className={styles.backButton}
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <BackArrowIcon />
    </button>
  );
}
