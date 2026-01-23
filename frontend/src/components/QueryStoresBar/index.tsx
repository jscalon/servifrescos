import styles from "./QueryStoresBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState } from "react";
import ExportToExcelButton from "../ExportToExcelButton";
import { type Store } from "../../services/api";

interface QueryStoresBarProps {
  onSearch: (value: string) => void;
  filteredData: Store[];
}

export default function QueryStoresBar({
  onSearch,
  filteredData,
}: QueryStoresBarProps) {
  const [search, setSearch] = useState<string>("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setSearch(newValue);
    onSearch(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(search);
    } else if (e.key === "Escape") {
      setSearch("");
      onSearch("");
    }
  };

  return (
    <div className={styles.queryStoresBar}>
      <BackButton to=".." />
      <span className={styles.span}>Buscar tiendas:</span>
      <InputText
        id="search"
        name="search"
        className={styles.input}
        value={search}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="Ingrese la tienda a buscar..."
      />
      <ExportToExcelButton
        data={filteredData}
        headers={["Número", "Nombre", "Dirección"]}
        keys={["number", "name", "address"]}
        fileName="Tiendas.xlsx"
      />
    </div>
  );
}
