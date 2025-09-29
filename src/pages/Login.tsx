import "./Login.css";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Content from "../components/Content/Content";
import Card from "../components/Card/Card";
import LoginCard from "../components/LoginCard/LoginCard";

function Login() {
  return (
    <div className="login">
      <Header />
      <Content title="Ficha de Productos">
        <Card>
          <LoginCard />
        </Card>
      </Content>
      <Footer />
    </div>
  );
}

export default Login;
