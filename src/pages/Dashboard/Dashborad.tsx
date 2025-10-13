import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Card width="260px">
        <h2 className="h-dark">Módulo:</h2>
        <Button text="Productos 🍗" onClick={() => navigate("/products")} />
        <Button text="Precios 💲" />
        <Button text="Permisos 👥" />
      </Card>
    </>
  );
}

export default Dashboard;
