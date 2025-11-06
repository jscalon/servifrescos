"""
Django production settings for backend project.

This file contains settings specific to the production environment.
"""

import os
from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
# In production, this should be loaded from environment variables
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-w&l#kxm@+h3vqi)t$4!-65o3pqn(=kv-q!$3*$2q@lz&x#8z@7')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    'your-domain.com',
    'www.your-domain.com',
    # Add your production domain here
]


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases
# In production, database credentials should come from environment variables

DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': os.environ.get('DB_NAME', 'Servifrescos'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '1433'),
        'USER': os.environ.get('DB_USER', ''),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
        },
    }
}


# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 31536000
SECURE_REDIRECT_EXEMPT = []
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'


# Static files configuration for production
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# Configuración de CORS para producción
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    # Add your production frontend URLs here
]

# Logging configuration for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}