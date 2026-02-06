from django.db import models


class Store(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.number}. {self.name}"

    class Meta:
        db_table = 'Stores'
        ordering = ['id']
