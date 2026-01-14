from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Permission


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Permisos', {
            'fields': ('permissions',)}),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_active')
    list_filter = ('is_active',)


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
