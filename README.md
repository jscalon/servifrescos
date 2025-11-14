# ServiFrescos

Aplicación web full-stack para la gestión de productos y precios en las tiendas Servifresco de Protinal Proagro.

## Arquitectura

Este proyecto utiliza una arquitectura de microservicios con separación clara entre frontend, backend y base de datos:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Django REST Framework
- **Base de datos**: SQL Server

## Estructura del Proyecto

```
servifresco/
├── frontend/           # React + TypeScript + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── eslint.config.js
│   └── index.html
├── backend/            # Django REST API
│   ├── backend/        # Configuración principal de Django
│   ├── apps/           # Aplicaciones Django (prices, products, users)
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3 (o configuración para SQL Server)
├── database/           # Archivos de base de datos
│   └── Servifrescos_DB/
├── docker/             # Configuraciones Docker
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── docs/               # Documentación
├── .gitignore
├── README.md
└── .env.example        # Variables de entorno
```

## Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose
- Node.js (para desarrollo local del frontend)
- Python 3.11+ (para desarrollo local del backend)

### Configuración Inicial

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd servifresco
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Levantar con Docker (Recomendado)**
   ```bash
   cd docker
   docker-compose up --build
   ```

4. **Desarrollo Local**

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
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

## Desarrollo

### Scripts Disponibles

**Frontend:**
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run lint` - Ejecuta linter

**Backend:**
- `python manage.py runserver` - Inicia servidor de desarrollo
- `python manage.py migrate` - Aplica migraciones de base de datos
- `python manage.py makemigrations` - Crea nuevas migraciones

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.