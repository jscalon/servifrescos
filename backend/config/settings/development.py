"""
Django development settings for backend project.

This file contains settings specific to the development environment.
"""

from .base import *
import os

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-w&l#kxm@+h3vqi)t$4!-65o3pqn(=kv-q!$3*$2q@lz&x#8z@7'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '172.20.12.33']


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'Servifrescos',  # Nombre de tu base de datos
        'HOST': 'db',  # Nombre del servicio en docker-compose
        'PORT': '1433',  # Puerto por defecto de SQL Server
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',  # Ajusta según tu driver instalado
        },
    }
}

# Read DB credentials from environment (use SQL Server auth inside Docker)
DATABASES['default']['USER'] = os.environ.get('DB_USER', 'sa')
DATABASES['default']['PASSWORD'] = os.environ.get(
    'DB_PASSWORD', 'YourStrong!Passw0rd')


# Configuración de zona horaria para desarrollo
TIME_ZONE = 'America/Caracas'

# Configuración de CORS para desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://172.20.12.33:5173"
]

# Permitir todas las origins en desarrollo (opcional, menos seguro)
# CORS_ALLOW_ALL_ORIGINS = True

# Configuración de email para desarrollo
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.protinalproagro.com.ve'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get(
    'DEFAULT_FROM_EMAIL', 'noreply@protinalproagro.com.ve')
