import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import InputPassword from "../../components/InputPassword";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userName = formData.get("username") as string;
    login(userName);
    navigate("/modules");
  };

  return (
    <main className={styles.main}>
      <h1>Ficha de Productos</h1>
      <form className={`card`} onSubmit={handleSubmit}>
        <img src={logos} alt="logos" className={styles.protinallogos} />
        <h2 className={`${styles.iniciarSesion} h-dark`}>Iniciar Sesión</h2>
        <InputText id="username" name="username" placeholder="Usuario" className={styles.inputText}/>
        <InputPassword id="password" name="password" placeholder="Contraseña" />
        <Button text="Ingresar" className={styles.button} />
        <Link to="/" className={styles.forgot}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </main>
  );
}
