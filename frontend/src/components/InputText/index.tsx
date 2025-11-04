import styles from "./InputText.module.css";

interface InputTextProps {
  placeholder?: string;
  id: string;
  name: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputText({
  placeholder = "",
  id,
  name,
  value = "",
  required = true,
	readOnly = false,
  onChange,
  className = "",
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
      onChange={onChange}
    />
  );
}
