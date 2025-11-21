from rest_framework import serializers
from .models import Price


class PriceSerializer(serializers.ModelSerializer):
    product_code = serializers.CharField(source='product.code', read_only=True)
    product_description = serializers.CharField(
        source='product.description', read_only=True)
    store_number = serializers.CharField(source='store.number', read_only=True)
    store_name = serializers.CharField(source='store.name', read_only=True)
    status = serializers.CharField(read_only=True)
    # created_by_username = serializers.CharField(
    #     source='created_by.username', read_only=True)

    class Meta:
        model = Price
        fields = [
            'id', 'product', 'product_code', 'product_description',
            'store', 'store_number', 'store_name', 'price',
            'registration_date', 'effective_date', 'expiration_date',
            'is_active', 'status', 'comment', # 'created_by', 'created_by_username',
        ]
        read_only_fields = ['registration_date'
                            # 'created_by_username'
                            ]

    def create(self, validated_data):
        # Asignar el usuario que crea el precio
        # user = self.context['request'].user
        # validated_data['created_by'] = user
        return super().create(validated_data)

