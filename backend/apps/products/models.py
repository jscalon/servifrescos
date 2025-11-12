from django.db import models


class Product(models.Model):
    code = models.CharField(max_length=100, primary_key=True)
    description = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    group = models.CharField(max_length=100)
    subgroup = models.CharField(max_length=100)

    class Meta:
        db_table = 'Products'

    def __str__(self):
        return self.code
