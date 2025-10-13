import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Ficha de Productos</h1>
      <Card width={250}>
        <h2 className="h-dark">Módulo:</h2>
        <Button
          text="Productos 🍗"
          width={170}
          height={45}
          onClick={() => navigate("/products")}
        />
        <Button text="Precios 💲" width={170} height={45} />
        <Button text="Permisos 👥" width={170} height={45} />
      </Card>
    </>
  );
}

export default Dashboard;
