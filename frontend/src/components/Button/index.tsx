import styles from "./Button.module.css";
import type { ReactNode } from "react";

interface ButtonProps {
  text: string;
  icon?: ReactNode;
	style?: "primary" | "secondary" | "other";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  text,
  icon,
	style = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={`${styles.button} ${styles[style]} ${className}`}
      onClick={onClick}
    >
      {text}
      {icon}
    </button>
  );
}
