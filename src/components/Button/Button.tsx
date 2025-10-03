import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  width?: number;
}

function Button({ text, width }: ButtonProps) {
  return (
    <button
      type="submit"
      className={styles.button}
      style={width ? { width: width + "px" } : undefined}
    >
      {text}
    </button>
  );
}

export default Button;
