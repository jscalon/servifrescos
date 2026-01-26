# AGENTS.md

Idioma Preferido: Español (Castellano).

Instrucción: El agente siempre debe responder en español (a menos que se indique lo contrario) todas las consultas, explicaciones, resúmenes y mensajes de commit en Español para asegurar la coherencia en la documentación y comunicación del proyecto.

## 1. Visión General del Proyecto: Sincronización Remota de Precios y Productos

### Objetivo Principal (El "Para Qué")

Desarrollar una aplicación web centralizada para la gestión remota de productos y precios de todas las tiendas minoristas de la empresa a nivel nacional.

El objetivo es eliminar la intervención manual del personal de tienda, permitiendo que el personal autorizado de la sede central realice las acciones de creación y actualización de productos y sus precios de manera directa en todas las bases de datos locales.

### Contexto Empresarial (El "Por Qué")

Actualmente, la ejecución de la actualización de productos y precios se realiza llevando a cabo los siguientes pasos:

1. El personal en sede central, encargado de determinar los cambios, ya habiéndolos determinado, procede a comunicar los respectivos cambios a realizar a través de mensajes de texto vía WhatsApp, a cada uno de los encargados de cada tienda respectiva.

2. Cada encargado de su respectiva tienda, luego de recibir el mensaje, procede a ejecutar las instrucciones de cambios indicados, mediante el entrar en el TPV de su tienda, el cual es una computadora windows que cuenta con un software especializado para la gestión de la tienda.

3. Dicho sofware se conecta a la base de datos local de la misma computadora, efectuando los cambios indicados.

El sistema a desarrollar debe resolver esta ineficiencia, centralizando el control de datos maestros, evitando la intervención del personal en tienda para ejecutar finalmente los cambios.

### Pila Tecnológica (Pila Principal)

- **Frontend:** React + TypeScript + Vite

- **Backend:** Django REST Framework

- **Base de Datos (Transitoria):** SQL Server (para la capa intermedia de gestión centralizada)

- **Base de Datos (Tiendas):** SQL Server (bases de datos locales existentes)

- **Contenedores:** Docker y Docker Compose para desarrollo y producción. Toda la aplicación se corre con docker compose up -d (o docker compose up -d --build, si es necesario).

## 2. Contexto de la Base de Datos y Arquitectura

### Arquitectura de Datos Actual

- Cada tienda tiene una **base de datos SQL Server local y única**.

- La estructura de la base de datos es **idéntica** en todas las tiendas.

- El **contenido de los productos** es generalmente idéntico, pero el campo `precio` de la tabla de productos **puede variar por tienda**.

- Las bases de datos locales **deben seguir funcionando** como fuente de datos para el TPV de cada tienda.

### Arquitectura de Solución (Capa Intermedia)

- Se requiere una **Base de Datos SQL Server Intermedia y Centralizada** (BD Central) para gestionar las actualizaciones.

- El Backend (Django REST Framework) debe interactuar primariamente con esta BD Central.

- **Desafío Clave:** La aplicación debe gestionar la comunicación remota desde la BD Central (o el Backend) hacia las **múltiples bases de datos SQL Server locales** de las tiendas para efectuar las modificaciones. (El agente debe priorizar el diseño de esta capa de comunicación en futuras tareas).

## 3. Directrices de Implementación y Convenciones

### Backend (Django REST Framework)

- **API Design:** Seguir el estilo RESTful, utilizando el serializador de Django REST Framework.

- **Nomenclatura:** Los modelos, vistas y URLs deben utilizar `snake_case`.

- **Comunicaciones:** Priorizar la modularización de la lógica de comunicación con las BD locales en un servicio o módulo aparte.

### Frontend (React + TypeScript)

- **TypeScript:** El código del Frontend debe ser fuertemente tipado.

- **Nomenclatura:** Componentes en `PascalCase`. Variables, funciones y _hooks_ en `camelCase`.

### Seguridad y Entorno

- La aplicación se ejecutará **dentro de la red y dominio privado de la empresa**. Se debe priorizar la autenticación y autorización de usuarios.

### Módulos principales de la apliación

- **Productos:** Encargado de la creación, modificación, y consulta de productos.
- **Precios:** Encargado de la creación de nuevos precios según el producto y la tienda. Cada precio nuevo debe ser programado por el usuario. La fecha de registro es automatica según la fecha y hora del momento de la creación. La fecha de efectividad es a partir de cuando será vigente ese precio. La fecha de vencimiento será nula al momento de la creación, y luego se actualizará automaticamente y será igual a la fecha de efectividad del siguiente nuevo precio que se cree para ese producto y tienda.
- **Categorías**: Encargado de la creación, modificación, y consulta de las 5 categorías (submodulos): marcas, tipos, departamentos, grupos, y subgrupos.
- **Tiendas**: Encargado de la creación, modificación, y consulta de tiendas.
- **Usuarios:** Encargado de la creación, modificación, y consulta de usuarios. Se gestionan los usuarios y se asignan sus respectivos permisos o roles, según los cuales tendrán los privilegios para acceder a ciertos módulos de la aplicación o no, según sea el caso. Además, se cuenta con un mecanismo de actualización de contraseña en caso de olvido por medio del email del usuario.
