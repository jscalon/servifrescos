from django.contrib import admin
from .models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ['number', 'name', 'address']
    search_fields = ['number', 'name', 'address']
    ordering = ['number']