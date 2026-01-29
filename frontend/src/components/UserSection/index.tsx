import styles from "./UserSection.module.css";
import Button from "../Button";
import { DoorIcon } from "../Icons";
import { useAuth } from "../../contexts";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserSection() {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const showUserSection =
    isLoggedIn && location.pathname.startsWith("/modules");
  const door = <DoorIcon />;

  return (
    <>
      {showUserSection && user && (
        <div className={styles.userSection}>
          <span>
            {user.first_name} {user.last_name}
          </span>
          <Button
            text="Salir"
            icon={door}
            style="other"
            className={styles.button}
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
