import styles from "./Select.module.css";
import type { ReactNode } from "react";

interface InputTextProps {
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
  className?: string;
  children?: ReactNode;
}

export default function Select({
  id,
  name,
  value = "",
  required = true,
  onChange,
  onKeyDown, // Añade este parámetro
  className = "",
  children,
}: InputTextProps) {
  return (
    <select
      className={styles.Select + " " + className}
      id={id}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      onKeyDown={onKeyDown} // Añade esta prop
    >
      {children}
    </select>
  );
}
