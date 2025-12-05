import styles from "./BackButton.module.css";
import { useNavigate } from "react-router-dom";
import { BackArrowIcon } from "../Icons";

interface BackButtonProps {
  to?: string;
  refresh?: boolean;
}

export default function BackButton({ to, refresh = false }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to, { state: { refresh } });
    } else {
      navigate(-1);
    }
  };

  return (
    <button className={styles.backButton} onClick={handleClick}>
      <BackArrowIcon />
    </button>
  );
}
