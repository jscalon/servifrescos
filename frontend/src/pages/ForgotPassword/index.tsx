import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/password_reset/", { email });
      setMessage("Se ha enviado un email de restablecimiento");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al enviar el email.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h1>Ficha de Productos</h1>
      <form className={`card`} onSubmit={handleSubmit}>
        <img src={logos} alt="logos" />
        <h2 className={`${styles.title} h-dark`}>Olvidé mi Contraseña</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message ? (
          <>
            <p style={{ color: "green" }}>{message}</p>
            <a
              href="https://webmail.protinalproagro.com.ve"
              rel="noopener noreferrer"
              className={styles.webmailLink}
            >
              Ir al Correo Electrónico
            </a>
          </>
        ) : (
          <>
            <InputText
              id="email"
              name="email"
              placeholder="Email"
              className={styles.inputText}
              value={email}
              onChange={handleEmailChange}
            />
            <Button
              text={loading ? "Enviando..." : "Enviar"}
              className={styles.button}
              disabled={loading}
            />
          </>
        )}
        <Link to="/login" className={styles.back}>
          Volver al Inicio de Sesión
        </Link>
      </form>
    </main>
  );
}
