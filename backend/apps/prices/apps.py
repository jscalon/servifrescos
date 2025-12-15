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
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            self.activate_prices_job,
            trigger=CronTrigger(minute='*'),
            id='activate_prices',
            max_instances=1,
            replace_existing=True,
        )
        scheduler.start()

    def activate_prices_job(self):
        try:
            call_command('activate_prices')
        except Exception as e:
            pass
