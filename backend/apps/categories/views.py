from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Brand, ProductType, Department, Group, Subgroup
from .serializers import BrandSerializer, ProductTypeSerializer, DepartmentSerializer, GroupSerializer, SubgroupSerializer


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]


class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [IsAuthenticated]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    lookup_field = 'code'
    permission_classes = [IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = 'code'
    permission_classes = [IsAuthenticated]


class SubgroupViewSet(viewsets.ModelViewSet):
    queryset = Subgroup.objects.all()
    serializer_class = SubgroupSerializer
    lookup_field = 'code'
    permission_classes = [IsAuthenticated]
