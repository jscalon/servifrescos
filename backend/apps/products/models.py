from django.db import models


class Product(models.Model):
    code = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=100)
    brand = models.ForeignKey('categories.Brand', on_delete=models.CASCADE)
    type = models.ForeignKey('categories.ProductType', on_delete=models.CASCADE)
    subgroup = models.ForeignKey('categories.Subgroup', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Products'

    def __str__(self):
        return self.code
