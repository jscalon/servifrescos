from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Permisos', {
            'fields': ('permissions',)}),
    )
    list_display = ('email', 'first_name', 'last_name',
                    'permissions', 'is_active')
    list_filter = ('is_active',)
