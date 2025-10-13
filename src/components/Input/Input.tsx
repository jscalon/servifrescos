import { useState } from "react";
import styles from "./Input.module.css";
import { EyeIcon } from "../Icons/Icons";

interface InputProps {
  type?: string;
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}

export default function Input({
  type = "text",
  placeholder = "",
  id,
  name,
  required = true,
  autoComplete = "new-password",
  defaultValue = "",
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
      defaultValue={defaultValue}
    />
  );

  if (type === "text") return inputElement;

  const closedEye = <EyeIcon closed={true} />;
  const openEye = <EyeIcon closed={false} />;

  return (
    <div className={styles.passwordWrapper}>
      {inputElement}
      <span
        className={styles.eye}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? openEye : closedEye}
      </span>
    </div>
  );
}
