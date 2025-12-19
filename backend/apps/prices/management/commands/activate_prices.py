from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.prices.models import Price


class Command(BaseCommand):
    help = 'Activa automáticamente los precios cuya fecha efectiva ha llegado'

    def handle(self, *args, **options):
        now = timezone.now()

        all_groups = Price.objects.values('product_id', 'store_id').distinct()

        activated_count = 0

        for group in all_groups:
            product_id = group['product_id']
            store_id = group['store_id']

            latest_eligible_price = Price.objects.filter(
                product_id=product_id,
                store_id=store_id,
                effective_date__lte=now
            ).order_by('-effective_date').first()

            if latest_eligible_price:
                current_active = Price.objects.filter(
                    product_id=product_id,
                    store_id=store_id,
                    is_active=True
                ).first()

                if current_active != latest_eligible_price:
                    if current_active:
                        current_active.is_active = False
                        current_active.expiration_date = latest_eligible_price.effective_date
                        current_active.save(update_fields=['is_active', 'expiration_date'])

                    latest_eligible_price.is_active = True
                    latest_eligible_price.save(update_fields=['is_active'])

                    activated_count += 1
