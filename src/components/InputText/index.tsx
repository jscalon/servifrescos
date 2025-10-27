import styles from "./InputText.module.css";

interface InputTextProps {
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

export default function InputText({
  placeholder = "",
  id,
  name,
  required = true,
	readOnly = false,
  className = "",
}: InputTextProps) {
  return (
    <input
      className={styles.inputText + " " + className}
      type="text"
      placeholder={placeholder}
      id={id}
      name={name}
      required={required}
			readOnly={readOnly}
    />
  );
}
