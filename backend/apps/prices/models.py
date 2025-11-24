from django.db import models, transaction
from django.utils import timezone
from apps.products.models import Product
from apps.stores.models import Store


class Price(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='prices'
    )
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name='prices'
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    registration_date = models.DateTimeField(auto_now_add=True)
    effective_date = models.DateTimeField()
    expiration_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    # created_by = models.ForeignKey(
    #     'users.CustomUser',
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     related_name='created_prices'
    # )
    comment = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = "Prices"
        unique_together = ['product', 'store', 'effective_date']
        ordering = ['-effective_date']

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Si es una creación nueva, actualizar el precio anterior
            if self.pk is None:
                # Buscar el precio anterior más reciente sin fecha de vencimiento
                previous_price = Price.objects.filter(
                    product=self.product,
                    store=self.store,
                    effective_date__lt=self.effective_date,
                    expiration_date__isnull=True
                ).order_by('-effective_date').first()

                if previous_price:
                    # Actualizar expiration_date del precio anterior
                    previous_price.expiration_date = self.effective_date
                    previous_price.save(update_fields=['expiration_date'])

            # Si este precio se está activando
            if self.is_active:
                # Buscar precio activo anterior para este producto/tienda
                previous_active_price = Price.objects.filter(
                    product=self.product,
                    store=self.store,
                    is_active=True
                ).exclude(pk=self.pk).first()

                if previous_active_price:
                    # Actualizar expiration_date del precio activo anterior
                    previous_active_price.expiration_date = self.effective_date
                    previous_active_price.is_active = False
                    previous_active_price.save()

            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.code} - {self.store.number} - ${self.price}"

    @property
    def is_expired(self):
        """Verifica si el precio ha expirado"""
        if self.expiration_date:
            return timezone.now() > self.expiration_date
        return False

    @property
    def status(self):
        """Retorna el estado del precio"""
        now = timezone.now()
        if self.is_active and not self.is_expired:
            return 'active'
        elif self.is_expired:
            return 'expired'
        elif self.effective_date > now:
            return 'scheduled'
        else:
            return 'inactive'
