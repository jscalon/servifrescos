import Button from "../Button";
import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
  title: string;
  message: string;
  onAccept: () => void;
}

export default function SuccessModal({
  title,
  message,
  onAccept,
}: SuccessModalProps) {
  return (
    <>
      <div className={styles.blurOverlay}></div>
      <div className={styles.successCard}>
        <h3>{title}</h3>
        <p className={styles.p}>{message}</p>
        <div className={styles.cardButtons}>
          <Button
            text="Aceptar"
            onClick={onAccept}
          ></Button>
        </div>
      </div>
    </>
  );
}
