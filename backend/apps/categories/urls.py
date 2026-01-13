from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, ProductTypeViewSet, DepartmentViewSet, GroupViewSet, SubgroupViewSet

router = DefaultRouter()
router.register(r'brands', BrandViewSet)
router.register(r'product-types', ProductTypeViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'subgroups', SubgroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
