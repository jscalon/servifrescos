import styles from "./UserSection.module.css";
import Button from "../Button/Button";
import { DoorIcon } from "../Icons/Icons";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserSection() {
  const { isLoggedIn, userName, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const showUserSection =
    isLoggedIn && location.pathname !== "/" && location.pathname !== "/login";

  const door = <DoorIcon />;

  return (
    <>
      {showUserSection && (
        <div className={styles.userSection}>
          <span>{userName}</span>
          <Button
            text="Salir"
            icon={door}
            width="fit-content"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          />
        </div>
      )}
    </>
  );
}
