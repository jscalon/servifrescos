import styles from "./Button.module.css";
import type { ReactNode } from "react";

interface ButtonProps {
  text: string;
  width?: string;
  height?: string;
  icon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({ text, width, height, icon, onClick }: ButtonProps) {
  return (
    <button
      type="submit"
      className={styles.button}
      style={{
        ...(width ? { width: width } : {}),
        ...(height ? { height: height } : {}),
      }}
      onClick={onClick}
    >
      {text}
      {icon}
    </button>
  );
}

export default Button;
