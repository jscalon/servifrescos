import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

function Products() {
  return (
    <>
      <Card width="260px">
        <h2 className="h-dark">Productos:</h2>
        <Button text="Creación 📝" width={"200"} height={"45"} />
        <Button text="Modificación 🔄" width={"200"} height={"45"} />
        <Button text="Consulta 🔍" width={"200"} height={"45"} />
      </Card>
    </>
  );
}

export default Products;
