import styles from "./InputPassword.module.css";
import { useState } from "react";
import { EyeIcon } from "../Icons";

interface InputProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string; // Añade value
  required?: boolean;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputPassword({
  placeholder = "",
  id,
  name,
  value = "", // Añade valor por defecto
  required = true,
  readOnly = false,
  className = "",
  onChange,
  onKeyDown,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputElement = (
    <input
      className={styles.inputPassword + " " + className}
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
    <div className={styles.wrapper}>
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
