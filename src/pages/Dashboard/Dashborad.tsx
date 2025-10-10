import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

function Dashboard() {
  return (
    <>
      <h1>Ficha de Productos</h1>
      <Card width={250}>
        <h3 className="h-dark">Módulo:</h3>
        <Button text="Productos 🍗" width={170} height={45} />
        <Button text="Precios 💲" width={170} height={45} />
        <Button text="Permisos 👥" width={170} height={45} />
      </Card>
    </>
  );
}

export default Dashboard;
