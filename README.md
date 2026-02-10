# ServiFrescos

Aplicación web full-stack para la gestión centralizada de productos y precios en las tiendas Servifresco a nivel nacional.

## Objetivo Principal

Desarrollar una aplicación web centralizada para la gestión remota de productos y precios de todas las tiendas minoristas "Servifresco" a nivel nacional.

El objetivo es eliminar la intervención manual del personal de tienda, permitiendo que el personal autorizado de la sede central realice las acciones de creación y actualización de productos y sus precios de manera directa en todas las bases de datos locales.

### Problema que Resuelve

**Situación Actual (Ineficiente):**

1. El personal en sede central comunica los cambios vía WhatsApp a cada encargado de tienda
2. Cada encargado debe ejecutar los cambios manualmente en el TPV (Terminal de Punto de Venta) de su tienda
3. Cada TPV tiene una aplicación de escritorio llamada "Stellar", la cual sirve de interfaz para conectarse a la base de datos local y efectuar los cambios

**Solución Propuesta:**

- Centralización del control de datos maestros
- El personal de sede puede actualizar productos y precios directamente
- Eliminación de la intervención del personal en tienda

## Arquitectura

Este proyecto utiliza una arquitectura de microservicios con separación clara entre frontend, backend y base de datos:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python + Django REST Framework
- **Base de datos**: SQL Server

### Arquitectura de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    Base de Datos Central                    │
│                    (BD de Gestión)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Django REST)                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Tienda 1    │   │ Tienda 2    │   │ Tienda N    │
│ BD Local    │   │ BD Local    │   │ BD Local    │
│ (SQL Server)│   │ (SQL Server)│   │ (SQL Server)│
└─────────────┘   └─────────────┘   └─────────────┘
```

**Características:**

- Cada tienda tiene una **base de datos SQL Server local e independiente**
- La estructura de la base de datos es **idéntica** en todas las tiendas
- El **contenido de los productos** es generalmente idéntico
- El campo `precio` de la tabla de productos **generalmente varía en cada tienda**
- Las bases de datos locales **deben seguir funcionando** como fuente de datos para el TPV de cada tienda

## Módulos de la Aplicación

### 1. Productos ([`backend/apps/products/`](backend/apps/products/))

Encargado de la creación, modificación y consulta de productos.

### 2. Precios ([`backend/apps/prices/`](backend/apps/prices/))

Encargado de la creación de nuevos precios según el producto y la tienda.

**Características:**

- Cada precio nuevo debe ser programado por el usuario
- La fecha de registro es automática según la fecha y hora del momento de la creación
- La fecha de efectividad es a partir de cuándo será vigente ese precio
- La fecha de vencimiento será nula al momento de la creación, y se actualizará automáticamente de modo que sea igual a la fecha de efectividad del siguiente nuevo precio que se cree para ese producto y tienda

**Comando de gestión:**

```bash
python manage.py activate_prices
```

Este comando activa los precios programados que han alcanzado su fecha de efectividad y desactiva los que hayan alcanzado su fecha de vencimiento.

### 3. Categorías ([`backend/apps/categories/`](backend/apps/categories/))

Encargado de la creación, modificación y consulta de las 5 categorías (submódulos):

- Marcas
- Tipos
- Departamentos
- Grupos
- Subgrupos

### 4. Tiendas ([`backend/apps/stores/`](backend/apps/stores/))

Encargado de la creación, modificación y consulta de tiendas.

### 5. Usuarios ([`backend/apps/users/`](backend/apps/users/))

Encargado de la creación, modificación y consulta de usuarios.

**Características:**

- Gestión de usuarios con asignación de permisos o roles
- Los permisos determinan los privilegios de acceso a los módulos
- Cada usuario tiene la obligación de cambiar su contraseña al logearse por primera vez
- Mecanismo de actualización de contraseña en caso de olvido por email

**Comando de gestión:**

```bash
python manage.py create_initial_permissions
```

Este comando crea los permisos iniciales del sistema.

## Convenciones de Código

### Backend (Django REST Framework)

- **API Design:** Estilo RESTful con serializadores de Django REST Framework
- **Nomenclatura:** Modelos, vistas y URLs en `snake_case`

### Frontend (React + TypeScript)

- **TypeScript:** Código fuertemente tipado
- **Nomenclatura:**
  - Componentes en `PascalCase`
  - Variables, funciones y hooks en `camelCase`

## Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose

### Configuración Inicial

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/JuanGimenez7/servifrescos
   cd servifrescos
   ```

2. **Configurar variables de entorno**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Editar los archivos .env con tus configuraciones
   ```

3. **Levantar con Docker**

- Abrir Docker Desktop para que corra el Docker Engine

```bash
docker compose up -d
```

### Configuración de Entornos

El proyecto soporta múltiples entornos:

- **Desarrollo:** [`backend/config/settings/development.py`](backend/config/settings/development.py)
- **Producción:** [`backend/config/settings/production.py`](backend/config/settings/production.py)

### Variables de Entorno

#### Backend (`.env`)

| Variable              | Descripción                           | Valor por defecto             |
| --------------------- | ------------------------------------- | ----------------------------- |
| `EMAIL_HOST`          | Servidor SMTP para envío de correos   | `mail.protinalproagro.com.ve` |
| `EMAIL_PORT`          | Puerto del servidor SMTP              | `465`                         |
| `EMAIL_USE_SSL`       | Usar SSL en la conexión               | `True`                        |
| `EMAIL_HOST_USER`     | Usuario del servidor SMTP             | -                             |
| `EMAIL_HOST_PASSWORD` | Contraseña del servidor SMTP          | -                             |
| `DEFAULT_FROM_EMAIL`  | Correo remitente por defecto          | `noreply@gmail.com`           |
| `FRONTEND_URL`        | URL del frontend                      | `http://<IP_DEL_HOST>:5173`   |
| `IP_DEL_HOST`         | IP del host donde corre la aplicación | -                             |

#### Frontend (`.env`)

| Variable         | Descripción                           | Valor por defecto                        |
| ---------------- | ------------------------------------- | ---------------------------------------- |
| `VITE_API_URL`   | URL del backend                       | `http://<IP_DEL_HOST>:8000/api`          |
| `IP_DEL_HOST`    | IP del host donde corre la aplicación | -                                        |
| `VITE_EMAIL_URL` | URL del webmail                       | `https://webmail.protinalproagro.com.ve` |

### Estructura del Proyecto

```
servifrescos/
├── backend/                    # Backend Django REST Framework
│   ├── apps/                  # Aplicaciones del proyecto
│   │   ├── products/         # Módulo de productos
│   │   ├── prices/           # Módulo de precios
│   │   ├── stores/           # Módulo de tiendas
│   │   ├── users/            # Módulo de usuarios
│   │   └── categories/       # Módulo de categorías
│   ├── config/                # Configuración del proyecto
│   │   ├── settings/         # Configuraciones de Django
│   │   ├── urls.py           # URLs principales
│   │   └── wsgi.py           # Configuración WSGI
│   ├── requirements.txt      # Dependencias Python
│   └── Dockerfile            # Imagen Docker del backend
├── frontend/                   # Frontend React + TypeScript
│   ├── src/                   # Código fuente
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── contexts/         # Contextos de React
│   │   └── assets/           # Recursos estáticos
│   ├── package.json          # Dependencias Node
│   └── Dockerfile            # Imagen Docker del frontend
└── docker-compose.yml        # Orquestación de contenedores
```

### API Reference

Todos los endpoints de la API están disponibles en `http://localhost:8000/api/` y requieren autenticación JWT.

#### Endpoints Disponibles

| Módulo         | Endpoint base      | Descripción                                                          |
| -------------- | ------------------ | -------------------------------------------------------------------- |
| **Productos**  | `/api/products/`   | CRUD de productos                                                    |
| **Precios**    | `/api/prices/`     | Gestión de precios por tienda                                        |
| **Tiendas**    | `/api/stores/`     | CRUD de tiendas                                                      |
| **Usuarios**   | `/api/users/`      | CRUD de usuarios                                                     |
| **Categorías** | `/api/categories/` | CRUD de categorías (marcas, tipos, departamentos, grupos, subgrupos) |
| **Auth**       | `/api/`            | Endpoints de autenticación                                           |

#### Autenticación

La API usa JWT (JSON Web Tokens). Para autenticarse:

1. Obtener token en `/api/users/token/` (POST con `username` y `password`)
2. Incluir el token en el header: `Authorization: Bearer <token>`

#### Recuperación de Contraseña

- **Solicitar recuperación:** `/api/password_reset/` (POST con `email`)
- **Confirmar recuperación:** `/api/reset/<uidb64>/<token>/` (POST con `new_password`)

## Uso

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Base de datos:** localhost:1433

Si se va a abrir la aplicación desde otro equipo que esté en la red protinal/proagro, se debe colocar en la barra de direcciones del navegador la dirección IP del host, seguido de ":" y el puerto "5173" (ejemplo: 172.20.12.33:5137)

## Características

- Gestión centralizada de productos y precios
- Programación de precios con fechas de efectividad y vencimiento
- Interfaz de usuario moderna e intuitiva con React + TypeScript
- API RESTful con Django REST Framework
- Sistema de autenticación y autorización basado en roles
- Base de datos SQL Server
- Configuración Docker para desarrollo y producción

## Comandos de Gestión

### Backend

```bash
# Crear migraciones
docker compose exec backend python manage.py makemigrations

# Aplicar migraciones
docker compose exec backend python manage.py migrate

# Crear permisos iniciales (solo al crear la base de datos desde 0)
docker compose exec backend python manage.py create_initial_permissions

# Activar precios programados (esto ya se ejecuta automaticamente con ayuda de las librería apscheduler)
docker compose exec backend python manage.py activate_prices

# Crear superusuario
docker compose exec backend python manage.py createsuperuser
```

## Seguridad

La aplicación se ejecuta **dentro de la red y dominio privado de la empresa**. Se prioriza la autenticación y autorización de usuarios mediante el sistema de permisos integrado.
