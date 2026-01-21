import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputPassword from "../../components/InputPassword";
import api from "../../services/api";

export default function ResetPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(false);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await api.post(`/reset/${uid}/${token}/`, {
        new_password: newPassword,
      });
      setMessage(true);
      setTimeout(() => navigate("/login"), 5000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Error al restablecer la contraseña.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h1>Ficha de Productos</h1>
      <form className={`card`} onSubmit={handleSubmit}>
        <img src={logos} alt="logos" className={styles.protinallogos} />
        <h2 className={`${styles.title} h-dark`}>Restablecer Contraseña</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && (
          <p style={{ color: "green" }}>
            ¡Contraseña restablecida exitosamente! <br />
            <br /> Redirigiendo a Login...
          </p>
        )}
        <InputPassword
          id="newPassword"
          name="newPassword"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={handleNewPasswordChange}
          classNameWrapper={styles.firstInput}
        />
        <InputPassword
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <Button
          text={loading ? "Restableciendo..." : "Restablecer"}
          className={styles.button}
          disabled={loading}
        />
      </form>
    </main>
  );
}
