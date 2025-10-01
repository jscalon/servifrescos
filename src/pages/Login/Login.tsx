import styles from "./Login.module.css";
import MainContent from "../../components/MainContent/MainContent";
import Card from "../../components/Card/Card";
import LoginCard from "../../components/LoginCard/LoginCard";

function Login() {
  return (
    <div className={styles.login}>

      <MainContent title="Ficha de Productos">
        <Card>
          <LoginCard />
        </Card>
      </MainContent>

    </div>
  );
}

export default Login;
