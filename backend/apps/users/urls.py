from django.urls import path
from .views import UserListCreateView, UserDetailView, PermissionListView, LoginView, ChangePasswordView


urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('permissions/', PermissionListView.as_view(), name='permission-list'),
    path('users/change-password/',
         ChangePasswordView.as_view(), name='change-password'),
]
