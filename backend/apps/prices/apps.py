from django.apps import AppConfig
from django.core.management import call_command
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

logger = logging.getLogger(__name__)

class PricesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.prices'

    def ready(self):
        # Quitar el if para que siempre se ejecute
        print("Iniciando scheduler...")  # Para ver si entra aquí
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            self.activate_prices_job,
            trigger=CronTrigger(minute='*'),  # Cada minuto para pruebas
            id='activate_prices',
            max_instances=1,
            replace_existing=True,
        )
        scheduler.start()
        print("Scheduler started for activate_prices")  # Cambiar a print para asegurar visibilidad

    def activate_prices_job(self):
        print("Ejecutando activate_prices_job...")  # Agregar print
        try:
            call_command('activate_prices')
            print("activate_prices command executed successfully")
        except Exception as e:
            print(f"Error executing activate_prices: {e}")
