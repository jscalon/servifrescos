import styles from "./InputText.module.css";

interface InputTextProps {
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
  autoComplete?: string;
}

export default function InputText({
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
  autoComplete = "off"
}: InputTextProps) {
  return (
    <input
      className={styles.inputText + " " + className}
      type="text"
      placeholder={placeholder}
      id={id}
      name={name}
      value={value}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete={autoComplete}
    />
  );
}
