from rest_framework import serializers
from .models import Price


class PriceSerializer(serializers.ModelSerializer):
    product_code = serializers.CharField(source='product.code', read_only=True)
    product_description = serializers.CharField(
        source='product.description', read_only=True)
    product_type = serializers.CharField(source='product.type', read_only=True)
    store_number = serializers.CharField(source='store.number', read_only=True)
    store_name = serializers.CharField(source='store.name', read_only=True)
    status = serializers.CharField(read_only=True)
    created_by_username = serializers.CharField(
        source='created_by.email', read_only=True)
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        max_value=99999999.99,
        required=True,
        error_messages={
            'max_decimal_places': 'El precio debe tener como máximo 2 decimales.',
            'invalid': 'El precio debe ser un número válido.',
        }
    )

    class Meta:
        model = Price
        fields = [
            'id', 'product', 'product_code', 'product_description', 'product_type',
            'store', 'store_number', 'store_name', 'price',
            'registration_date', 'effective_date', 'expiration_date',
            'is_active', 'status', 'comment', 'created_by_username',
        ]
        read_only_fields = ['registration_date', 'created_by_username']

    def create(self, validated_data):
        # Asignar el usuario que crea el precio
        user = self.context['request'].user
        validated_data['created_by'] = user
        return super().create(validated_data)
