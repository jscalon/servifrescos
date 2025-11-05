import InputText from "../InputText";
import styles from "./InputField.module.css";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  id: string;
  name: string;
  value: string;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputField({
  label,
  className = "",
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={styles.inputField + " " + className}>
      <label
        htmlFor={inputProps.id}
        className={styles.label}
      >
        {label}
      </label>
      <InputText {...inputProps} />
    </div>
  );
}
