import styles from "./Login.module.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import MainContent from "../../components/MainContent/MainContent";
import Card from "../../components/Card/Card";
import LoginCard from "../../components/LoginCard/LoginCard";

function Login() {
  return (
    <div className={styles.login}>
      <Header />
      <MainContent title="Ficha de Productos">
        <Card>
          <LoginCard />
        </Card>
      </MainContent>
      <Footer />
    </div>
  );
}

export default Login;
