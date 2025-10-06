import { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  type: string;
  placeholder: string;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

function Input({
  type,
  placeholder,
  id,
  name,
  required,
  autoComplete,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputElement = (
    <input
      className={styles.input}
      type={type === "password" && showPassword ? "text" : type}
      placeholder={placeholder}
      id={id}
      name={name}
      required={required}
      autoComplete={autoComplete}
    />
  );

  if (type === "text") {
    return inputElement;
  }

  const openEye = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const closedEye = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="3" />
    </svg>
  );

  return (
    <div className={styles.passwordWrapper}>
      {inputElement}
      <span
        className={styles.togglePassword}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? openEye : closedEye}
      </span>
    </div>
  );
}

export default Input;
