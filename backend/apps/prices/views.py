from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
    ordering = ['-effective_date']

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

    def perform_create(self, serializer):
        # Asignar el usuario que crea el precio
        # serializer.save(created_by=self.request.user)
        serializer.save()
