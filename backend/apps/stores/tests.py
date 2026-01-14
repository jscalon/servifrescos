from django.test import TestCase
from .models import Store


class StoreModelTest(TestCase):
    def test_store_creation(self):
        store = Store.objects.create(
            number=1, name="Tienda Central", address="Dirección de ejemplo")
        self.assertEqual(store.number, 1)
        self.assertEqual(store.name, "Tienda Central")
        self.assertEqual(store.address, "Dirección de ejemplo")
        self.assertIsNotNone(store.id)
        self.assertEqual(str(store), f"{store.id} - Tienda Central")
