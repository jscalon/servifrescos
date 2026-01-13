from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Brand, ProductType
from .serializers import BrandSerializer, ProductTypeSerializer


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]


class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [IsAuthenticated]
