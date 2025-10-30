import styles from "./UserManagement.module.css";
import UsersBar from "../../../components/UsersBar";
import { Outlet, useLocation } from "react-router-dom";

export default function UserManagement() {
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
                <th>Primer Nombre</th>
                <th>Primer Apellido</th>
                <th>Nombre de Usuario</th>
                <th>Roles</th>
                <th>Activo</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {arr(4).map(() => (
                <tr>
                  {arr(6).map(() => (
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
