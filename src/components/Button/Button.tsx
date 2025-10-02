import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
}

function Button({ text }: ButtonProps) {
  return (
    <button type="submit" className={styles.button}>
      {text}
    </button>
  );
}

export default Button;
