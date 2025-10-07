import { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  type?: string;
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
}

function Input({
  type = "text",
  placeholder = "",
  id,
  name,
  required = true,
  autoComplete = "new-password",
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

  if (type === "text") return inputElement;

  const EyeIcon = ({ closed }: { closed: boolean }) => (
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
      <path d="M 1 12 s 4 -8 11 -8 11 8 11 8 -4 8 -11 8 -11 -8 -11 -8 z" />
      <circle cx="12" cy="12" r="3" />
      {closed && <line x1="3" y1="3" x2="21" y2="21" strokeWidth="3" />}
    </svg>
  );

  const closedEye = <EyeIcon closed={true} />;
  const openEye = <EyeIcon closed={false} />;

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
