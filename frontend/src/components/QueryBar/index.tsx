import styles from "./QueryBar.module.css";
import Button from "../Button";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";
import Select from "../Select";

interface QueryBarProps {
  onSearch: (field: string, value: string) => void;
  onClear: () => void;
}

export default function QueryBar({ onSearch, onClear }: QueryBarProps) {
  const [searchField, setSearchField] = useState<string>("code");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value.toUpperCase());
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchField, searchValue.trim());
    } else {
      onClear(); // Si no hay valor, mostrar todos
    }
  };

  const handleClear = () => {
    setSearchValue(""); // Limpia el input
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.queryBar}>
      <BackButton to="/modules/products" />
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
      <Button text="Buscar" className={styles.button} onClick={handleSearch} />
      <Button
        text="Reiniciar"
        className={styles.button}
        onClick={handleClear}
        style="secondary"
      />
    </div>
  );
}
