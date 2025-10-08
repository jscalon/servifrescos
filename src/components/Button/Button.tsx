import styles from "./Button.module.css";
import type { ReactNode } from "react";

interface ButtonProps {
  text: string;
  width?: number;
  height?: number;
  children?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({ text, width, height, children, onClick }: ButtonProps) {
  return (
    <button
      type="submit"
      className={styles.button}
      style={{
        ...(width ? { width: width + "px" } : {}),
        ...(height ? { height: height + "px" } : {}),
      }}
      onClick={onClick}
    >
      {text}
			{children}
    </button>
  );
}

export default Button;
