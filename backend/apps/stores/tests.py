from django.test import TestCase
from .models import Store


class StoreModelTest(TestCase):
    def test_store_creation(self):
        store = Store.objects.create(number="001", name="Tienda Central")
        self.assertEqual(store.number, "001")
        self.assertEqual(store.name, "Tienda Central")
        self.assertEqual(str(store), "001 - Tienda Central")