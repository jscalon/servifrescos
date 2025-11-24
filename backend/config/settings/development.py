"""
Django development settings for backend project.

This file contains settings specific to the development environment.
"""

from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-w&l#kxm@+h3vqi)t$4!-65o3pqn(=kv-q!$3*$2q@lz&x#8z@7'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'Servifrescos',  # Nombre de tu base de datos
        'HOST': 'localhost',  # O la IP/dominio de tu servidor SQL Server
        'PORT': '1433',  # Puerto por defecto de SQL Server
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',  # Ajusta según tu driver instalado
        },
    }
}


# Configuración de zona horaria para desarrollo
TIME_ZONE = 'America/Caracas'

# Configuración de CORS para desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Permitir todas las origins en desarrollo (opcional, menos seguro)
# CORS_ALLOW_ALL_ORIGINS = True