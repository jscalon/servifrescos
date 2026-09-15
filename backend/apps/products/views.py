from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer, ProductCreateSerializer


class ProductViewSet(viewsets.ModelViewSet):
    # El serializador recorre brand, type y subgroup -> group -> department;
    # sin select_related cada producto dispara una consulta por relacion.
    queryset = Product.objects.select_related(
        'brand', 'type', 'subgroup', 'subgroup__group',
        'subgroup__group__department')
    lookup_field = 'code'
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer
