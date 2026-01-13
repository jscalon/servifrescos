from rest_framework import serializers
from .models import Brand, ProductType


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = '__all__'
