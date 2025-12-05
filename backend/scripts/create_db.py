import os
import time
import socket
import traceback

import pyodbc


def wait_tcp(host, port, timeout=120):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, int(port)), timeout=5):
                return True
        except Exception:
            time.sleep(1)
    return False


def try_pyodbc_connect(host, port, user, password):
    # try using registered driver name first
    named = (
        f"DRIVER={{{{ODBC Driver 17 for SQL Server}}}};"
        f"SERVER={host},{port};UID={user};PWD={password};"
        "Encrypt=no;TrustServerCertificate=yes;"
    )
    # Try by registered driver name first; if it fails, try known absolute library paths.
    common_paths = [
        "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.10.so.1.1",
        "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.7.so.1.1",
        "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.6.so.1.1",
        "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.3.so.1.1",
        "/usr/lib/libmsodbcsql-17.so",
        "/usr/lib/x86_64-linux-gnu/odbc/libmsodbcsql-17.so",
    ]

    try:
        conn = pyodbc.connect(named, autocommit=True)
        conn.close()
        return True, None
    except Exception as e_named:
        last_exc = e_named
        for lib in common_paths:
            if not os.path.exists(lib):
                continue
            alt = (
                f"DRIVER={lib};SERVER={host},{port};UID={user};PWD={password};"
                "Encrypt=no;TrustServerCertificate=yes;"
            )
            try:
                conn = pyodbc.connect(alt, autocommit=True)
                conn.close()
                return True, None
            except Exception as e_alt:
                last_exc = e_alt
                continue
        return False, last_exc


def connect_with_fallback(host, port, user, password, database=None):
    """Return an open pyodbc connection or raise the last exception."""
    db_part = f";DATABASE={database}" if database else ""
    # try named driver
    named = (
        f"DRIVER={{{{ODBC Driver 17 for SQL Server}}}};"
        f"SERVER={host},{port};UID={user};PWD={password};"
        "Encrypt=no;TrustServerCertificate=yes;"
        + db_part
    )
    try:
        return pyodbc.connect(named, autocommit=True)
    except Exception as e_named:
        last_exc = e_named
        # try absolute paths
        common_paths = [
            "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.10.so.1.1",
            "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.7.so.1.1",
            "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.6.so.1.1",
            "/opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.3.so.1.1",
            "/usr/lib/libmsodbcsql-17.so",
            "/usr/lib/x86_64-linux-gnu/odbc/libmsodbcsql-17.so",
        ]
        for lib in common_paths:
            if os.path.exists(lib):
                alt = (
                    f"DRIVER={lib};SERVER={host},{port};UID={user};PWD={password};"
                    "Encrypt=no;TrustServerCertificate=yes;"
                    + (db_part or "")
                )
                try:
                    return pyodbc.connect(alt, autocommit=True)
                except Exception as e_alt:
                    last_exc = e_alt
                    continue
        # none worked
        raise last_exc


def create_database_if_not_exists(host, port, user, password, db_name='Servifrescos'):
    try:
        conn = connect_with_fallback(
            host, port, user, password, database='master')
        cursor = conn.cursor()
        cursor.execute("SELECT db_id(?)", (db_name,))
        row = cursor.fetchone()
        if row is None or row[0] is None:
            print(f"Database '{db_name}' not found. Creating...")
            cursor.execute(f"CREATE DATABASE [{db_name}]")
            print("Database created.")
        else:
            print(f"Database '{db_name}' already exists.")
        cursor.close()
        conn.close()
    except Exception:
        print("Error while creating/checking database (ver detalles en trace):")
        traceback.print_exc()
        raise


if __name__ == '__main__':
    host = os.environ.get('DB_HOST', 'db')
    port = os.environ.get('DB_PORT', '1433')
    user = os.environ.get('DB_USER', 'sa')
    password = os.environ.get('DB_PASSWORD', 'YourStrong!Passw0rd')

    print(f"Waiting for tcp {host}:{port} (socket)...")
    if not wait_tcp(host, port, timeout=180):
        print("TCP port did not open in time")
        raise SystemExit("DB did not become available in time")

    print("TCP port open, trying DB connection via pyodbc...")
    ok, err = try_pyodbc_connect(host, port, user, password)
    if not ok:
        print("Initial pyodbc connect failed; reintentando algunas veces...")
        attempts = 5
        for i in range(attempts):
            ok, err = try_pyodbc_connect(host, port, user, password)
            if ok:
                break
            time.sleep(2)

    if not ok:
        print("DB connection failed after reintentos. Mostrar último error:")
        traceback.print_exception(type(err), err, err.__traceback__)
        raise SystemExit("DB did not become available in time")

    print("DB reachable with pyodbc — creating/checking database...")
    create_database_if_not_exists(host, port, user, password)
