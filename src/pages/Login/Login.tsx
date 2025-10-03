import Card from "../../components/Card/Card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import protinalLogo from "../../assets/protinal-logo.jpg";
import proagroLogo from "../../assets/proagro-logo.jpg";
import Button from "../../components/Button/Button";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <>
      <h1>Ficha de Productos</h1>
      <Card>
        <div className={styles.logos}>
          <img
            src={protinalLogo}
            alt="protinalLogo"
            className={styles.protinalLogo}
          />
          <img
            src={proagroLogo}
            alt="proagroLogo"
            className={styles.proagroLogo}
          />
        </div>
        <h2 className={styles.iniciarSesion + " h-dark"}>Iniciar Sesión</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="new-password"
              placeholder="Usuario"
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Contraseña"
              />
              <span className={styles.togglePassword} onClick={togglePassword}>
                {showPassword ? (
                  // Ojo abierto
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  // Ojo tachado (línea más gruesa)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    <line x1="3" y1="3" x2="21" y2="21" strokeWidth="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>
          <Button text="Ingresar" />
        </form>
      </Card>
    </>
  );
}

export default Login;
