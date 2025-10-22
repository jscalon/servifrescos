import styles from "./InputPassword.module.css";
import { useState } from "react";
import { EyeIcon } from "../Icons";

interface InputProps {
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  className?: string;
}

export default function Input({
  placeholder = "",
  id,
  name,
  required = true,
  className = "",
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputElement = (
    <input
      className={styles.inputPassword + " " + className}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      id={id}
      name={name}
      required={required}
      autoComplete="new-password"
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
