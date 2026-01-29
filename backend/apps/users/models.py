from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('password_changed', False)
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name,
                          last_name=last_name, **extra_fields)
        user.username = email
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)


class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Nombre')

    class Meta:
        db_table = 'Permissions'
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'

    def __str__(self):
        return self.name


class User(AbstractUser):
    username = models.CharField(
        max_length=150, blank=True, null=True, verbose_name='Username')
    email = models.EmailField(unique=True, verbose_name='Email')
    permissions = models.ManyToManyField(
        Permission, blank=True, verbose_name='Permisos')
    password_changed = models.BooleanField(
        default=False, verbose_name='Contraseña Cambiada')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        db_table = 'Users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
