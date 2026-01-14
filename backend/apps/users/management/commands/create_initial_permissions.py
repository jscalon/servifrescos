from django.core.management.base import BaseCommand
from apps.users.models import Permission


class Command(BaseCommand):
    help = 'Create initial permissions'

    def handle(self, *args, **options):
        permissions = [
            'view_product',
            'add_product',
            'change_product',
            'view_store',
            'add_store',
            'change_store',
            'view_price',
            'add_price',
            'view_user',
            'add_user',
            'change_user',
            'view_category',  # Para categorías
        ]

        for perm_name in permissions:
            Permission.objects.get_or_create(name=perm_name)
            self.stdout.write(self.style.SUCCESS(
                f'Created permission: {perm_name}'))

        self.stdout.write(self.style.SUCCESS(
            'All initial permissions created successfully'))
