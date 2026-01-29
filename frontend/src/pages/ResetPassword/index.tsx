import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputPassword from "../../components/InputPassword";
import api from "../../services/api";

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("Debe tener al menos 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una letra mayúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una letra minúscula");
  }
  if (!/\d/.test(password)) {
    errors.push("Debe contener al menos un número");
  }
  return errors;
};

export default function ResetPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage(false);

    if (passwordErrors.length > 0 || passwordMatchError) {
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
    const value = e.target.value;
    setNewPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
    if (value !== confirmPassword) {
      setPasswordMatchError("Las contraseñas no coinciden");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (newPassword !== value) {
      setPasswordMatchError("Las contraseñas no coinciden");
    } else {
      setPasswordMatchError("");
    }
  };

  return (
    <main className={styles.main}>
      <form className={`card`} onSubmit={handleSubmit}>
        <img src={logos} alt="logos" className={styles.protinallogos} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message ? (
          <p style={{ color: "green" }}>
            ¡Contraseña restablecida exitosamente! <br />
            <br /> Redirigiendo a Login...
          </p>
        ) : (
          <>
            <h2 className={`${styles.title} h-dark`}>Restablecer Contraseña</h2>
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
            {passwordMatchError && (
              <div className={styles.passwordError}>{passwordMatchError}</div>
            )}
            {passwordErrors.map((error, index) => (
              <div key={index} className={styles.passwordError}>
                {error}
              </div>
            ))}
            <Button
              text={loading ? "Restableciendo..." : "Restablecer"}
              className={styles.button}
              disabled={loading}
            />
          </>
        )}
      </form>
    </main>
  );
}
