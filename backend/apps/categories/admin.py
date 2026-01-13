from django.contrib import admin
from .models import Brand, ProductType, Department, Group, Subgroup

admin.site.register(Brand)
admin.site.register(ProductType)
admin.site.register(Department)
admin.site.register(Group)
admin.site.register(Subgroup)
