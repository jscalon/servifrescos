import styles from "./Dashboard.module.css"; // Crea este archivo si necesitas estilos
import Header from "../../components/Header/Header";
import MainContent from "../../components/MainContent/MainContent";
import Card from "../../components/Card/Card";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Header />
      <MainContent title="Selecciona un Módulo">
        <Card>
          <h2>¿Qué módulo deseas usar?</h2>
          {/* Agrega opciones aquí, e.g., botones para diferentes módulos */}
        </Card>
      </MainContent>
    </div>
  );
}

export default Dashboard;
