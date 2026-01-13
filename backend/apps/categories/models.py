from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'Brands'

    def __str__(self):
        return self.name


class ProductType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'ProductTypes'

    def __str__(self):
        return self.name


class Department(models.Model):
    code = models.CharField(max_length=10, unique=True)
    description = models.CharField(max_length=100)

    class Meta:
        db_table = 'Departments'

    def __str__(self):
        return self.description
