# Guía rápida para correr el aplicativo

## Iniciar aplicativo

1. Abrir aplicativo **Docker Desktop.** Una vez que el motor de Docker corra (usualmente tarda menos de 1 minuto), se puede cerrar la ventana.
2. Abrir una terminal en la carpeta raíz del proyecto.
3. Ejecutar:
   ```
   docker compose up -d
   ```
4. Esperar 2-3 minutos a que todo cargue completamente.

**Nota:** El aplicativo permanecerá activo mientras el equipo esté encendido, incluso si la sesión de Windows está bloqueada.

---

## Acceder y usar el aplicativo

1. Desde cualquier equipo conectado a la red de **Protinal/Proagro.**
2. Abrir cualquier navegador (Chrome, Edge, Firefox, etc.).
3. Escribir en la barra de direcciones:
   ```
   http://<IP_DEL_HOST>:5173
   ```
   _Ejemplo: `http://172.20.12.33:5173`_

---

## Detener el aplicativo

1. Abrir una terminal en la carpeta raíz del proyecto.
2. Ejecutar:
   ```
   docker compose down
   ```
