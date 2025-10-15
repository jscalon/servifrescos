import Card from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userName = formData.get("username") as string;
    login(userName); // Llama a login con el nombre
    navigate("/dashboard");
  };

  return (
    <>
      <h1>Ficha de Productos</h1>
      <Card>
        <img src={logos} alt="logos" className={styles.protinallogos} />
        <h2 className={`${styles.iniciarSesion} h-dark`}>Iniciar Sesión</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputs}>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Usuario"
            />
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
            />
          </div>
          <Button text="Ingresar" className={styles.button}/>
        </form>
        <Link to="/" className={styles.forgot}>
          ¿Olvidaste tu contraseña?
        </Link>
      </Card>
    </>
  );
}
