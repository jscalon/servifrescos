import styles from "./Users.module.css";
import UsersBar from "../../../components/UsersBar";
import { Outlet, useLocation } from "react-router-dom";

export default function Users() {
  const location = useLocation();

  function arr(n: number) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(false);
    }
    return arr;
  }

  return (
    <>
      {location.pathname == "/modules/users" && (
        <main className={styles.main}>
          <h1>Usuarios</h1>
          <UsersBar></UsersBar>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre de Completo</th>
                <th>Email</th>
                <th>Permisos</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {arr(4).map(() => (
                <tr>
                  {arr(4).map(() => (
                    <td></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
      <Outlet />
    </>
  );
}
