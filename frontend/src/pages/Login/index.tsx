import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import InputPassword from "../../components/InputPassword";
import { useAuth } from "../../contexts";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/modules");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h1>Ficha de Productos</h1>
      <form className={`card ${styles.card}`} onSubmit={handleSubmit}>
        <img src={logos} alt="logos" className={styles.protinallogos} />
        <h2 className={`${styles.iniciarSesion} h-dark`}>Iniciar Sesión</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <InputText
          id="email"
          name="email"
          placeholder="Email"
          className={styles.inputText}
          value={email}
          onChange={handleEmailChange}
        />
        <InputPassword
          id="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          text={loading ? "Cargando..." : "Ingresar"}
          className={styles.button}
          disabled={loading}
        />
      </form>
    </main>
  );
}
