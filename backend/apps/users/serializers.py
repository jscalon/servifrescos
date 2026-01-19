from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Permission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['name']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    permissions = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=Permission.objects.all()
    )

    class Meta:
        model = User
        fields = ['id', 'password', 'first_name',
                  'last_name', 'email', 'permissions', 'is_active', 'date_joined', 'last_login']

    def create(self, validated_data):
        permissions = validated_data.pop('permissions', [])
        user = User.objects.create_user(**validated_data)
        user.permissions.set(permissions)
        return user

    def update(self, instance, validated_data):
        permissions = validated_data.pop('permissions', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        if permissions is not None:
            instance.permissions.set(permissions)
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
