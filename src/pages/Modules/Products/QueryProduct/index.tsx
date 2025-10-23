import styles from "./QueryProduct.module.css";
import QueryBar from "../../../../components/QueryBar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import InputField from "../../../../components/InputField";

export default function QueryProduct() {
  return (
    <>
      <QueryBar></QueryBar>
      <h1>Consultar Productos</h1>
      <Card className={styles.card}>
        <form action=""></form>
      </Card>
    </>
  );
}
