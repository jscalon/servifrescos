import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  width?: number;
	height?: number;
}

function Button({ text, width, height }: ButtonProps) {
  return (
    <button
      type="submit"
      className={styles.button}
      style={{
        ...(width ? { width: width + "px" } : {}),
        ...(height ? { height: height + "px" } : {})
      }}
    >
      {text}
    </button>
  );
}

export default Button;
