from rest_framework import serializers
from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'

    def validate_number(self, value):
        """Valida que el número de tienda sea un entero positivo."""
        if value is not None and value < 1:
            raise serializers.ValidationError(
                "El número de tienda debe ser un entero positivo."
            )
        return value
