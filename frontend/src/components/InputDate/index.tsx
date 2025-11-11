import styles from "./InputDate.module.css";

interface InputDateProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputDate({
  placeholder = "",
  id,
  name,
  value = "",
  required = true,
  readOnly = false,
  min,
  max,
  onChange,
  onKeyDown,
  className = "",
}: InputDateProps) {
  return (
    <input
      className={styles.inputDate + " " + className}
      type="date"
      placeholder={placeholder}
      id={id}
      name={name}
      value={value}
      required={required}
      readOnly={readOnly}
      min={min}
      max={max}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}