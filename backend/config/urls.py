from django.contrib import admin
from django.urls import path, include
from apps.users.views import PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.products.urls')),
    path('api/', include('apps.prices.urls')),
    path('api/', include('apps.stores.urls')),
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.categories.urls')),
    path('api/password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/reset/<uidb64>/<token>/',
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
