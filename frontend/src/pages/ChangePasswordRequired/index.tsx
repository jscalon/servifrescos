import styles from "./ChangePasswordRequired.module.css";
import logos from "../../assets/protinalproagro-logos.png";
import Button from "../../components/Button";
import InputPassword from "../../components/InputPassword";
import { useState } from "react";
import { useAuth } from "../../contexts";
import { usersAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

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

export default function ChangePasswordRequired() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
    if (confirmPassword && value !== confirmPassword) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordErrors.length > 0 || passwordMatchError) {
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Por favor complete todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await usersAPI.changePassword(newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/modules");
      }, 5000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Error al cambiar la contraseña";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className={styles.main}>
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        <img src={logos} />
        <h2 className={`${styles.title} h-dark`}>
          ¡Bienvenido/a, {user?.first_name}!
        </h2>
        {success ? (
          <p className={styles.successMessage}>
            ¡Establecimiento de contraseña exitoso!
            <br /> <br />
            Redirigiendo a la aplicación...
          </p>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}
            <p> Establece tu contraseña</p>
            <InputPassword
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={passwordErrors.length > 0}
              required
              placeholder="Nueva Contraseña"
            />
            <InputPassword
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!passwordMatchError}
              required
              placeholder="Confirmar Contraseña"
              classNameWrapper={styles.confirm}
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
              text={loading ? "Estableciendo..." : "Establecer"}
              type="submit"
              disabled={
                loading || passwordErrors.length > 0 || !!passwordMatchError
              }
              className={styles.button}
            />
            {!loading && (
              <Button
                text="Cerrar Sesión"
                style="reset"
                type="button"
                onClick={handleLogout}
                className={`${styles.button} ${styles.outButton}`}
              />
            )}
          </>
        )}
      </form>
    </main>
  );
}
