import styles from "./QueryPricesBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState, useEffect } from "react";
import Select from "../Select";
import { storesAPI, type Store, type Price } from "../../services/api";
import ExportToExcelButton from "../ExportToExcelButton";

interface QueryPricesBarProps {
  onSearch: (filters: {
    article: string;
    store: string;
    active: string;
  }) => void;
  onClear: () => void;
  filteredData: Price[];
}

export default function QueryPricesBar({
  onSearch,
  onClear,
  filteredData,
}: QueryPricesBarProps) {
  const [selectedStore, setSelectedStore] = useState<string>("Todos");
  const [searchArticle, setsearchArticle] = useState<string>("");
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

  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const article = e.target.value.toUpperCase();
    setsearchArticle(article);
    triggerSearch(article, selectedStore, selectedActive);
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const store = e.target.value;
    setSelectedStore(store);
    triggerSearch(searchArticle, store, selectedActive);
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const active = e.target.value;
    setSelectedActive(active);
    triggerSearch(searchArticle, selectedStore, active);
  };

  const triggerSearch = (article: string, store: string, active: string) => {
    onSearch({
      article: article.trim(),
      store,
      active,
    });
  };

  const handleClear = () => {
    setsearchArticle("");
    setSelectedStore("Todos");
    setSelectedActive("Todos");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch(searchArticle, selectedStore, selectedActive);
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={styles.queryPricesBar}>
      <BackButton to="/modules/prices" />
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
      <span className={styles.span}>Artículo:</span>
      <InputText
        id="searchArticle"
        name="searchArticle"
        className={styles.input}
        value={searchArticle}
        onChange={handleArticleChange}
        onKeyDown={handleKeyDown}
        placeholder="Código o Descripción..."
      />
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
      <ExportToExcelButton
        data={filteredData.map((price) => ({
          ...price,
          registration_date: price.registration_date ? new Date(price.registration_date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
          effective_date: price.effective_date ? new Date(price.effective_date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
          expiration_date: price.expiration_date ? new Date(price.expiration_date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
          is_active: price.is_active ? 'Sí' : 'No',
        }))}
        headers={[
          "Código",
          "Servifresco",
          "Descripción",
          "Tipo",
          "Precio ($)",
          "Fecha de Registro",
          "Fecha de Efectividad",
          "Fecha de Vencimiento",
          "Vigente",
          "Creado por",
          "Comentario",
        ]}
        keys={[
          "product_code",
          "store_name",
          "product_description",
          "product_type",
          "price",
          "registration_date",
          "effective_date",
          "expiration_date",
          "is_active",
          "created_by_username",
          "comment",
        ]}
        fileName="Precios.xlsx"
      />
    </div>
  );
}
