from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, ProductTypeViewSet

router = DefaultRouter()
router.register(r'brands', BrandViewSet)
router.register(r'product-types', ProductTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
