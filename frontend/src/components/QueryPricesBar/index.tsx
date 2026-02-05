import styles from "./QueryPricesBar.module.css";
import InputText from "../InputText";
import BackButton from "../BackButton";
import { useState, useEffect } from "react";
import Select from "../Select";
import { myStoresAPI, type Store, type Price } from "../../services/api";
import ExportToExcelButton from "../ExportToExcelButton";
import { usePermissions } from "../../contexts";

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
  const { hasPermission } = usePermissions();
  const [selectedStore, setSelectedStore] = useState<string>("Todos");
  const [searchArticle, setSearchArticle] = useState<string>("");
  const [selectedActive, setSelectedActive] = useState<string>("Todos");
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoaded, setStoresLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStores = async () => {
      try {
        // Si tiene permisos de precios, obtener sus tiendas asignadas
        if (hasPermission("view_price") || hasPermission("manage_price")) {
          const res = await myStoresAPI.getMyStores();
          if (isMounted) {
            setStores(res.data);
            setStoresLoaded(true);
          }
        } else {
          if (isMounted) {
            setStores([]);
            setStoresLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error loading stores:", error);
        if (isMounted) {
          setStores([]);
          setStoresLoaded(true);
        }
      }
    };

    fetchStores();

    return () => {
      isMounted = false;
    };
  }, [hasPermission]);

  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const article = e.target.value.toUpperCase();
    setSearchArticle(article);
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
    setSearchArticle("");
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

  // Verificar si el usuario tiene acceso al módulo de precios
  if (!hasPermission("view_price") && !hasPermission("manage_price")) {
    return null; // No mostrar nada si no tiene permisos
  }

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
        {storesLoaded &&
          stores
            .sort((a, b) => a.number - b.number)
            .map((s) => (
              <option key={`store-${s.id}`} value={s.name}>
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
          registration_date: price.registration_date
            ? new Date(price.registration_date).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "",
          effective_date: price.effective_date
            ? new Date(price.effective_date).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "",
          expiration_date: price.expiration_date
            ? new Date(price.expiration_date).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "",
          is_active: price.is_active ? "Sí" : "No",
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
