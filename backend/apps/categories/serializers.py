from rest_framework import serializers
from .models import Brand, ProductType, Department, Group, Subgroup


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class SubgroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subgroup
        fields = '__all__'
