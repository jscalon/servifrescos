import styles from "./Select.module.css";
import type { ReactNode } from "react";

interface SelectProps {
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
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
  disabled = false,
  onChange,
  onKeyDown, // Añade este parámetro
  className = "",
  children,
}: SelectProps) {
  return (
    <select
      className={styles.Select + " " + className}
      id={id}
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown} // Añade esta prop
    >
      {children}
    </select>
  );
}
