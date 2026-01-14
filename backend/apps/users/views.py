from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Permission
from .serializers import UserSerializer, LoginSerializer, PermissionSerializer


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class PermissionListView(generics.ListAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]


class LoginView(APIView):
    permission_classes = []  # No requiere autenticación

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            refresh['first_name'] = user.first_name
            refresh['last_name'] = user.last_name
            permissions_list = [perm.name for perm in user.permissions.all()]
            refresh['permissions'] = permissions_list
            return Response({
                'access': str(refresh.access_token),
                'user_id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'permissions': permissions_list,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
