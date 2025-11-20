from django.db import models


class Store(models.Model):
    number = models.CharField(max_length=10, unique=True, primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.number} - {self.name}"

    class Meta:
        db_table = 'Stores'
        ordering = ['number']