from django.contrib import admin
from .models import Price


@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ['product', 'store', 'price',
                    'effective_date', 'is_active', 'status']
    list_filter = ['is_active', 'store', 'effective_date']
    search_fields = ['product__code', 'product__description', 'store__number']
    readonly_fields = ['registration_date']
    ordering = ['-effective_date']

    def status(self, obj):
        return obj.status.title()
    status.short_description = 'Status'
