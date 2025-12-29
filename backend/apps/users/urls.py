from django.urls import path
from .views import UserListCreateView, UserDetailView, LoginView


urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
