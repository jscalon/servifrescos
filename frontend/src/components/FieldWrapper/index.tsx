import styles from "./FieldWrapper.module.css";
import type { ReactNode } from "react";

interface FieldWrapperProps {
  label: string;
  id: string;
  className?: string;
  children: ReactNode;
}

export default function FieldWrapper({
  label,
  id,
  className = "",
  children,
}: FieldWrapperProps) {
  return (
    <div className={styles.fieldWrapper + " " + className}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}
