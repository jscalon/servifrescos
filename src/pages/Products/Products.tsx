import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

function Products() {
  return (
    <>
      <Card width={250}>
        <h2 className="h-dark">Productos:</h2>
        <Button text="Creación 📝" width={170} height={45} />
        <Button text="Modificación 🔄" width={170} height={45} />
        <Button text="Consulta 🔍" width={170} height={45} />
      </Card>
    </>
  );
}

export default Products;
