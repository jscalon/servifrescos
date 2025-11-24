import styles from "./PricesBar.module.css";
import Button from "../Button";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../Select";
import { storesAPI, type Store } from "../../services/api";

interface PricesBarProps {
  onSearch: (filters: {
    field: string;
    value: string;
    store: string;
    active: string;
  }) => void;
  onClear: () => void;
}

export default function PricesBar({ onSearch, onClear }: PricesBarProps) {
  const navigate = useNavigate();
  const [searchField, setSearchField] = useState<string>("code");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("Todos");
  const [selectedActive, setSelectedActive] = useState<string>("Todos");
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storesAPI.getAll();
        setStores(res.data);
      } catch (error) {
        // Error al cargar las tiendas
      }
    };
    fetchStores();
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field = e.target.value;
    setSearchField(field);
    triggerSearch(field, searchValue, selectedStore, selectedActive);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchValue(value);
    triggerSearch(searchField, value, selectedStore, selectedActive);
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const store = e.target.value;
    setSelectedStore(store);
    triggerSearch(searchField, searchValue, store, selectedActive);
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const active = e.target.value;
    setSelectedActive(active);
    triggerSearch(searchField, searchValue, selectedStore, active);
  };

  const triggerSearch = (field: string, value: string, store: string, active: string) => {
    onSearch({
      field,
      value: value.trim(),
      store,
      active,
    });
  };

  const handleClear = () => {
    setSearchValue("");
    setSelectedStore("Todos");
    setSelectedActive("Todos");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch(searchField, searchValue, selectedStore, selectedActive);
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.pricesBar}>
      <BackButton to="/modules" />
      <span className={styles.span}>Columna:</span>
      <Select
        name="searchField"
        id="searchField"
        className={styles.select}
        value={searchField}
        onChange={handleFieldChange}
      >
        <option value="code">Código</option>
        <option value="description">Descripción</option>
        <option value="type">Tipo</option>
        <option value="price">Precio</option>
        <option value="comment">Comentario</option>
      </Select>
      <InputText
        id="searchValue"
        name="searchValue"
        className={styles.input}
        value={searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
      />
      <span className={styles.span}>Servifresco:</span>
      <Select
        id="searchStore"
        name="searchStore"
        className={styles.select}
        value={selectedStore}
        onChange={handleStoreChange}
      >
        <option value="Todos">Todos</option>
        {stores.map((s) => (
          <option key={s.number} value={s.name}>
            {s.name}
          </option>
        ))}
      </Select>
      <span className={styles.span}>Vigente:</span>
      <Select
        id="active"
        name="active"
        className={styles.select}
        value={selectedActive}
        onChange={handleActiveChange}
      >
        <option>Todos</option>
        <option>✅</option>
        <option>❌</option>
      </Select>
      <Button
        text="Nuevo 💲"
        className={styles.button}
        onClick={() => navigate("/modules/prices/new")}
      />
    </div>
  );
}
