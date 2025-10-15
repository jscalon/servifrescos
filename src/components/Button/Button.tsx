import styles from "./Button.module.css";
import type { ReactNode } from "react";

interface ButtonProps {
  text: string;
  icon?: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  text,
  icon,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={styles.button + " " + className}
      onClick={onClick}
    >
      {text}
      {icon}
    </button>
  );
}
