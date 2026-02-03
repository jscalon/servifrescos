from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Permission, UserStore
from apps.stores.serializers import StoreSerializer
from apps.stores.models import Store


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['name']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    permissions = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=Permission.objects.all(), required=False
    )
    stores = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Store.objects.all(),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = User
        fields = ['id', 'password', 'first_name',
                  'last_name', 'email', 'permissions', 'stores', 'is_active', 'date_joined', 'last_login']

    def to_representation(self, instance):
        """Personalizar la representación para incluir detalles de stores"""
        representation = super().to_representation(instance)
        representation['stores'] = list(
            instance.stores.values('id', 'number', 'name')
        )
        return representation

    def create(self, validated_data):
        permissions = validated_data.pop('permissions', [])
        stores = validated_data.pop('stores', [])
        user = User.objects.create_user(**validated_data)
        user.permissions.set(permissions)
        user.stores.set(stores)
        return user

    def update(self, instance, validated_data):
        permissions = validated_data.pop('permissions', None)
        stores = validated_data.pop('stores', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        if permissions is not None:
            instance.permissions.set(permissions)
        if stores is not None:
            instance.stores.set(stores)
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('Debe incluir email y password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Usuario inexistente')

        if not user.is_active:
            raise serializers.ValidationError('Usuario inactivo')

        if not user.check_password(password):
            raise serializers.ValidationError('Contraseña incorrecta')

        attrs['user'] = user
        return attrs
