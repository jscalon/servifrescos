from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Price
from .serializers import PriceSerializer


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['product', 'store', 'is_active', 'effective_date']
    ordering_fields = ['effective_date', 'price', 'registration_date']
    ordering = ['-registration_date']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrar precios por las tiendas asignadas al usuario"""
        queryset = super().get_queryset()
        user = self.request.user

        # Obtener permisos del usuario
        user_permissions = list(
            user.permissions.values_list('name', flat=True))

        # Si el usuario tiene view_price o manage_price, filtrar por tiendas asignadas
        if 'view_price' in user_permissions or 'manage_price' in user_permissions:
            # El usuario solo puede ver precios de tiendas asignadas
            queryset = queryset.filter(store__in=user.stores.all())

        return queryset

    def perform_create(self, serializer):
        """Validar que el usuario pueda crear precios en la tienda seleccionada"""
        user = self.request.user
        store_id = serializer.validated_data.get('store').id

        # Verificar que el usuario tenga permisos de precios
        user_permissions = list(
            user.permissions.values_list('name', flat=True))

        if 'manage_price' not in user_permissions:
            raise PermissionError('No tienes permisos para crear precios')

        # Verificar que la tienda esté asignada al usuario
        if not user.stores.filter(id=store_id).exists():
            raise PermissionError('No tienes acceso a esta tienda')

        # Asignar el usuario que crea el precio
        serializer.save(created_by=user)

    @action(detail=False, methods=['get'])
    def active_prices(self, request):
        """Obtener precios activos por tienda"""
        store_id = request.query_params.get('store')
        if store_id:
            prices = Price.objects.filter(store_id=store_id, is_active=True)
        else:
            prices = Price.objects.filter(is_active=True)

        serializer = self.get_serializer(prices, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def price_history(self, request):
        """Obtener historial de precios para un producto/tienda"""
        product_id = request.query_params.get('product')
        store_id = request.query_params.get('store')

        if not product_id or not store_id:
            return Response(
                {"error": "Se requieren parámetros 'product' y 'store'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        prices = Price.objects.filter(product_id=product_id, store_id=store_id)
        serializer = self.get_serializer(prices, many=True)
        return Response(serializer.data)
