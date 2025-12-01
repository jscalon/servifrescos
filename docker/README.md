# Docker: Instrucciones rápidas

Resumen de cambios aplicados por el asistente:

- `backend/scripts/create_db.py`: limpieza de prints de depuración y mensajes más concisos. Mantiene el fallback a rutas de librería absolutas para el driver ODBC.
- `docker/Dockerfile.backend`: registra una entrada mínima en `/etc/odbcinst.ini` apuntando a `/usr/lib/libmsodbcsql-17.so` y añade `LD_LIBRARY_PATH` para ayudar a `pyodbc` a localizar la librería.
- `docker/docker-compose.yml`: añade un `healthcheck` basado en TCP para el servicio `db`.

Pasos recomendados para reconstruir y levantar todo (desde `docker/`):

```bash
# En el directorio docker/
# 1) (Opcional) Eliminar datos si quieres forzar la re-inicialización de la base:
#    rm -rf db_data/*

# 2) Reconstruir las imágenes (asegura que Dockerfile.backend se aplique):
docker-compose build --no-cache backend

# 3) Levantar los servicios:
docker-compose up --build

# 4) Logs rápidos:
# Backend
docker logs -f <nombre_contenedor_backend> --tail 200
# DB
docker logs -f <nombre_contenedor_db> --tail 200
```

Notas y recomendaciones:

- Asegúrate de que `MSSQL_SA_PASSWORD` en `docker-compose.yml` coincide con `DB_PASSWORD` que recibe el backend (por defecto: `YourStrong!Passw0rd`).
- Si el contenedor de base de datos ya tiene datos en `db_data/`, el script `init.sql` NO se re-ejecutará automáticamente; borra `db_data` si necesitas volver a aplicar `init.sql`.
- Si quieres un healthcheck más robusto que ejecute una consulta SQL, puedes instalar `mssql-tools` en la imagen `db` o ajustar la comprobación para llamar a `sqlcmd`.

Si quieres, puedo:
- Ejecutar el `git commit` con mensaje en español y crear una rama nueva antes de commitear.
- Añadir un `healthcheck` que use `sqlcmd` instalando `mssql-tools` en la imagen `db` (si lo prefieres).
