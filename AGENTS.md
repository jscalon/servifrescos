# AGENTS.md

Idioma Preferido: Español (Castellano).

Instrucción: El agente debe responder todas las consultas, explicaciones, resúmenes y mensajes de commit en Español para asegurar la coherencia en la documentación y comunicación del proyecto.

## 1. Visión General del Proyecto: Sincronización Remota de Precios y Productos

### Objetivo Principal (El "Para Qué")

Desarrollar una aplicación web centralizada para la gestión remota de productos y precios de todas las tiendas minoristas de la empresa a nivel nacional.

El objetivo es eliminar la intervención manual del personal de tienda, permitiendo que el personal autorizado de la sede central realice las acciones de creación y actualización de productos (incluyendo precios) de manera directa en todas las bases de datos locales.

### Contexto Empresarial (El "Por Qué")

Actualmente, la actualización de productos y precios se realiza mediante comunicación externa (WhatsApp/Correo) y ejecución manual por el personal de cada tienda en sus respectivos sistemas TPV locales.

El sistema debe resolver esta ineficiencia, centralizando el control de datos maestros.

### Pila Tecnológica (Pila Principal)

- **Frontend:** React + TypeScript + Vite

- **Backend:** Django REST Framework

- **Base de Datos (Transitoria):** SQL Server (para la capa intermedia de gestión centralizada)

- **Base de Datos (Tiendas):** SQL Server (bases de datos locales existentes)

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

- La aplicación se ejecutará **dentro de la red y dominio privado de la empresa**. Se debe priorizar la autenticación y autorización basada en el dominio o la red interna, y en el usuario de windows.

### Módulos principales de la apliación

- **Productos:** Encargado de la creación, modificación, y consulta de productos.
- **Precios:** Encargado de la creación de nuevos precios según el producto y la tienda. Debe ser programada por el usuario. La fecha de registro es automatica según la fecha y hora del momento de la creación. La fecha de efectividad es a partir de cuando será vigente ese precio. La fecha de vencimiento será nula al momento de la creación, y luego se actualizará automaticamente y será igual a la fecha de efectividad del siguiente nuevo precio que se cree para ese producto y tienda.
- **Usuarios:** Encargado de gestionar los usuarios con sus respectivos permisos o roles, crear nuevos usuarios, etc.
