import styles from "./InputNumber.module.css";

interface InputNumberProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  step?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputNumber({
  placeholder = "",
  id,
  name,
  value = "",
  required = true,
  readOnly = false,
  step,
  min,
  max,
  onChange,
  onKeyDown,
  className = "",
}: InputNumberProps) {
  return (
    <input
      className={styles.inputNumber + " " + className}
      type="number"
      placeholder={placeholder}
      id={id}
      name={name}
      value={value}
      required={required}
      readOnly={readOnly}
      step={step}
      min={min}
      max={max}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}
