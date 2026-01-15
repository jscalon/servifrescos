from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.StringRelatedField()
    type = serializers.StringRelatedField()
    subgroup = serializers.StringRelatedField()
    department = serializers.CharField(
        source='subgroup.group.department.description', read_only=True)
    group = serializers.CharField(
        source='subgroup.group.description', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'  # Incluye todos los campos


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
