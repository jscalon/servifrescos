import styles from "./QueryBrandsBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";
import ExportToExcelButton from "../ExportToExcelButton";
import { type Brand } from "../../services/api";

interface QueryBrandsBarProps {
  onSearch: (value: string) => void;
  onClear: () => void;
  filteredData: Brand[];
}

export default function QueryBrandsBar({
  onSearch,
  onClear,
  filteredData,
}: QueryBrandsBarProps) {
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
    <div className={styles.queryBrandsBar}>
      <BackButton to=".." />
      <span className={styles.span}>Buscar marca:</span>
      <InputText
        id="searchValue"
        name="searchValue"
        className={styles.input}
        value={searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="Ingrese el nombre de la marca..."
      />
      <ExportToExcelButton
        data={filteredData}
        headers={["Nombre"]}
        keys={["name"]}
        fileName="Marcas.xlsx"
      />
    </div>
  );
}
