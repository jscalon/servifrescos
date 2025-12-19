import styles from "./QueryProductsBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";
import Select from "../Select";

interface QueryProductsBarProps {
  onSearch: (field: string, value: string) => void;
  onClear: () => void;
}

export default function QueryProductsBar({
  onSearch,
  onClear,
}: QueryProductsBarProps) {
  const [searchField, setSearchField] = useState<string>("code");
  const [searchValue, setSearchValue] = useState<string>("");

  const triggerSearch = (field: string, value: string) => {
    if (value.trim()) {
      onSearch(field, value.trim());
    } else {
      onClear();
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value;
    setSearchField(newField);
    triggerSearch(newField, searchValue);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setSearchValue(newValue);
    triggerSearch(searchField, newValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch(searchField, searchValue);
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.queryProductsBar}>
      <BackButton to=".." />
      <span className={styles.span}>Criterio de búsqueda:</span>
      <Select
        name="searchField"
        id="searchField"
        className={styles.select}
        value={searchField}
        onChange={handleFieldChange}
      >
        <option value="code">Código</option>
        <option value="description">Descripción</option>
        <option value="brand">Marca</option>
        <option value="type">Tipo</option>
        <option value="department">Departamento</option>
        <option value="group">Grupo</option>
        <option value="subgroup">Subgrupo</option>
      </Select>
      <InputText
        id="searchValue"
        name="searchValue"
        className={styles.input}
        value={searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="Ingrese el producto a buscar..."
      />
    </div>
  );
}
