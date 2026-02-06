from django.db import models
from django.core.exceptions import ValidationError


def validate_positive_number(value):
    """Valida que el número sea positivo."""
    if value is not None and value < 1:
        raise ValidationError(
            "El número de tienda debe ser un entero positivo.",
            code='invalid_number'
        )


class Store(models.Model):
    number = models.IntegerField(unique=True, validators=[
                                 validate_positive_number])
    name = models.CharField(max_length=100)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.number}. {self.name}"

    class Meta:
        db_table = 'Stores'
        ordering = ['id']
