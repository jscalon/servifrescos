import styles from "./Button.module.css";
import type { ReactNode } from "react";

interface ButtonProps {
  text: string;
  icon?: ReactNode;
  style?: "primary" | "secondary" | "other";
  type?: "submit" | "button" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  text,
  icon,
  style = "primary",
  type = "submit",
  disabled = false,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${styles[style]} ${className}`}
      onClick={onClick}
    >
      {text}
      {icon}
    </button>
  );
}
