import styles from "./InputPassword.module.css";
import { useState } from "react";
import { EyeIcon } from "../Icons";

interface InputProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string; // Añade value
  required?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Añade onChange
}

export default function Input({
  placeholder = "",
  id,
  name,
  value = "", // Añade valor por defecto
  required = true,
  className = "",
  onChange, // Añade parámetro
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
      autoComplete="new-password"
      onChange={onChange} // Añade onChange
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
