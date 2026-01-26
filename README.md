# ServiFrescos

Aplicación web full-stack para la gestión de productos y precios en las tiendas Servifresco de Protinal Proagro.

## Arquitectura

Este proyecto utiliza una arquitectura de microservicios con separación clara entre frontend, backend y base de datos:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Django REST Framework
- **Base de datos**: SQL Server

## Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose

### Configuración Inicial

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd servifrescos
   ```

2. **Configurar variables de entorno**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Editar los archivos .env con tus configuraciones
   ```

3. **Levantar con Docker**
   ```bash
   docker compose up -d
   ```

## Uso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Base de datos**: localhost:1433

## Características

- Gestión de productos y precios
- Interfaz de usuario moderna con React
- API RESTful con Django REST Framework
- Autenticación de usuarios
- Base de datos SQL Server
- Configuración Docker para desarrollo y producción

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
