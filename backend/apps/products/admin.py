from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'brand', 'type', 'department']
    search_fields = ['code', 'description', 'brand']
    list_filter = ['brand', 'type', 'department', 'group', 'subgroup']
    ordering = ['code']
