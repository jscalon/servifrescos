import styles from "./Dashboard.module.css"; // Crea este archivo si necesitas estilos
import Header from "../../components/Header/Header";
import Content from "../../components/Content/Content";
import Card from "../../components/Card/Card";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Header />
      <Content title="Selecciona un Módulo">
        <Card>
          <h2>¿Qué módulo deseas usar?</h2>
          {/* Agrega opciones aquí, e.g., botones para diferentes módulos */}
        </Card>
      </Content>
    </div>
  );
}

export default Dashboard;
