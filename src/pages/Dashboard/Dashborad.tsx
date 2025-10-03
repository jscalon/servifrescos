import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

function Dashboard() {
  return (
      <>
      <h1>Ficha de Productos</h1>
        <Card>
          <h3 className="h-dark">Módulo:</h3>
          <Button text="Productos" width={200}/>
          <Button text="Precios"/>
          <Button text="Permisos" width={200}/>
        </Card>
      </>
  );
}

export default Dashboard;
