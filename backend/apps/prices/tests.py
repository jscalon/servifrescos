from django.test import TestCase
from django.utils import timezone
from backend.apps.products.models import Product
from backend.apps.stores.models import Store
from .models import Price


class PriceModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            code="TEST001",
            description="Producto de prueba",
            brand="Marca",
            type="Tipo",
            department="Departamento",
            group="Grupo",
            subgroup="Subgrupo"
        )
        self.store = Store.objects.create(number="001", name="Tienda Central")

    def test_price_creation(self):
        price = Price.objects.create(
            product=self.product,
            store=self.store,
            price=10.50,
            effective_date=timezone.now()
        )
        self.assertEqual(price.price, 10.50)
        self.assertEqual(price.is_active, False)

    def test_price_expiration_logic(self):
        # Crear precio activo
        active_price = Price.objects.create(
            product=self.product,
            store=self.store,
            price=10.50,
            effective_date=timezone.now(),
            is_active=True
        )

        # Crear nuevo precio
        new_price = Price.objects.create(
            product=self.product,
            store=self.store,
            price=11.00,
            effective_date=timezone.now(),
            is_active=True
        )

        # Verificar que el precio anterior se desactivó y tiene expiration_date
        active_price.refresh_from_db()
        self.assertFalse(active_price.is_active)
        self.assertIsNotNone(active_price.expiration_date)

    def test_automatic_expiration_on_new_price(self):
        # Crear primer precio sin activar
        from datetime import timedelta
        now = timezone.now()
        first_price = Price.objects.create(
            product=self.product,
            store=self.store,
            price=10.50,
            effective_date=now
        )

        # Crear segundo precio con fecha efectiva posterior
        second_effective_date = now + timedelta(days=1)
        second_price = Price.objects.create(
            product=self.product,
            store=self.store,
            price=11.00,
            effective_date=second_effective_date
        )

        # Verificar que el primer precio tiene expiration_date igual a la effective_date del segundo
        first_price.refresh_from_db()
        self.assertEqual(first_price.expiration_date, second_effective_date)