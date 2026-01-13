from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.StringRelatedField()
    type = serializers.StringRelatedField()
    subgroup = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = '__all__'  # Incluye todos los campos
