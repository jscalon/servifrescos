import styles from "./InputText.module.css";

interface InputTextProps {
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  className?: string;
}

export default function InputText({
  placeholder = "",
  id,
  name,
  required = true,
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
    />
  );
}
