import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import InputPassword from "../../components/InputPassword";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import { useState } from "react"; // Añade este import

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(""); // Añade estado
  const [password, setPassword] = useState<string>(""); // Añade estado

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username);
    navigate("/modules");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h1>Ficha de Productos</h1>
      <form className={`card`} onSubmit={handleSubmit}>
        <img src={logos} alt="logos" className={styles.protinallogos} />
        <h2 className={`${styles.iniciarSesion} h-dark`}>Iniciar Sesión</h2>
        <InputText
          id="username"
          name="username"
          placeholder="Usuario"
          className={styles.inputText}
          value={username} // Añade value
          onChange={handleUsernameChange} // Añade onChange
        />
        <InputPassword
          id="password"
          name="password"
          placeholder="Contraseña"
          value={password} // Añade value
          onChange={handlePasswordChange} // Añade onChange
        />
        <Button text="Ingresar" className={styles.button} />
        <Link to="/" className={styles.forgot}>
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </main>
  );
}
