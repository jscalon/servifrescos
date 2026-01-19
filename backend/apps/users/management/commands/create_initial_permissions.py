from django.core.management.base import BaseCommand
from apps.users.models import Permission


class Command(BaseCommand):
    help = 'Create initial permissions'

    def handle(self, *args, **options):
        permissions = [
            'view_product',
            'manage_product',
            'view_price',
            'manage_price',
            'view_category',
            'manage_category',
            'view_store',
            'manage_store',
            'view_user',
            'manage_user',
        ]

        for perm_name in permissions:
            Permission.objects.get_or_create(name=perm_name)
            self.stdout.write(self.style.SUCCESS(
                f'Created permission: {perm_name}'))

        self.stdout.write(self.style.SUCCESS(
            'All initial permissions created successfully'))
