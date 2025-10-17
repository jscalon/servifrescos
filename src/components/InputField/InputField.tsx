import InputText from "../InputText/InputText";
import styles from "./InputField.module.css";

interface InputFieldProps {
  label: string;
  labelClassName?: string;
  placeholder?: string;
  id: string;
  name: string;
  required?: boolean;
  className?: string;
}

export default function InputField({
  label,
  labelClassName = "",
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={styles.inputField}>
      <label
        htmlFor={inputProps.id}
        className={styles.label + " " + labelClassName}
      >
        {label}
      </label>
      <InputText {...inputProps} />
    </div>
  );
}
