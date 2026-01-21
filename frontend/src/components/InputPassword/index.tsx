import styles from "./InputPassword.module.css";
import { useState } from "react";
import { EyeIcon } from "../Icons";

interface InputProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  classNameWrapper?: string;
}

export default function InputPassword({
  placeholder = "",
  id,
  name,
  value = "", // Añade valor por defecto
  required = true,
  readOnly = false,
  error = false,
  className = "",
  onChange,
  onKeyDown,
  classNameWrapper = "",
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputElement = (
    <input
      className={`${styles.inputPassword} ${
        error ? styles.error : ""
      } ${className}`}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      id={id}
      name={name}
      value={value} // Añade value
      required={required}
      readOnly={readOnly}
      autoComplete="new-password"
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );

  const closedEye = <EyeIcon closed={true} />;
  const openEye = <EyeIcon closed={false} />;

  return (
    <div className={`${styles.wrapper} ${classNameWrapper}`}>
      {inputElement}
      <span
        className={styles.eyeContainer}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? openEye : closedEye}
      </span>
    </div>
  );
}
