import Button from "../Button";
import styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <>
      <div className={styles.blurOverlay}></div>
      <div className={styles.confirmationCard}>
        <h3 className="h-light">{title}</h3>
        <p className={styles.p}>{message}</p>
        <div className={styles.cardButtons}>
          <Button text="Cancelar" style="secondary" onClick={onCancel}></Button>
          <Button
            text="Confirmar"
            style="primary"

            onClick={onConfirm}
          ></Button>
        </div>
      </div>
    </>
  );
}
