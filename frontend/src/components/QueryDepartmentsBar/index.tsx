import styles from "./QueryDepartmentsBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";

interface QueryDepartmentsBarProps {
  onSearch: (value: string) => void;
  onClear: () => void;
}

export default function QueryDepartmentsBar({
  onSearch,
  onClear,
}: QueryDepartmentsBarProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  const triggerSearch = (value: string) => {
    if (value.trim()) {
      onSearch(value.trim());
    } else {
      onClear();
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setSearchValue(newValue);
    triggerSearch(newValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch(searchValue);
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.queryDepartmentsBar}>
      <BackButton to=".." />
      <span className={styles.span}>Buscar departamento:</span>
      <InputText
        id="searchValue"
        name="searchValue"
        className={styles.input}
        value={searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="Ingrese el código o descripción del departamento..."
      />
    </div>
  );
}
