import styles from "./InputEmail.module.css";
import { useState, useEffect } from "react";

interface InputEmailProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  onErrorChange?: (error: string) => void;
}

export default function InputEmail({
  placeholder = "",
  id,
  name,
  value = "",
  required = true,
  readOnly = false,
  disabled = false,
  onChange,
  onKeyDown,
  className = "",
  onErrorChange,
}: InputEmailProps) {
  const [error, setError] = useState<string>("");

  const isValidEmail = (email: string) => {
    return (
      email.endsWith("@protinal.com.ve") ||
      email.endsWith("@protinalproagro.com.ve")
    );
  };

  const validateEmail = (email: string) => {
    if (email && !isValidEmail(email)) {
      setError(
        "El email debe terminar en @protinal.com.ve o @protinalproagro.com.ve"
      );
    } else {
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    validateEmail(e.target.value);
  };

  useEffect(() => {
    if (onErrorChange) {
      onErrorChange(error);
    }
  }, [error, onErrorChange]);

  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.inputEmail} ${
          error ? styles.error : ""
        } ${className}`}
        type="email"
        placeholder={placeholder}
        id={id}
        name={name}
        value={value}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
