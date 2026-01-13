from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'brand', 'type', 'subgroup']
    search_fields = ['code', 'description']
    list_filter = ['brand', 'type', 'subgroup']
    ordering = ['code']
