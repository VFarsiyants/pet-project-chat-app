from django.conf import settings
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        data = {
            'access': str(refresh.access_token),
            'user': serializer.data,
        }
        
        response = Response(data)
        cookie_max_age = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

        response.set_cookie(
            'refresh', 
            str(refresh),
            max_age=cookie_max_age,
            httponly=True
        )

        return response
    

class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        current_user = self.request.user
        return super().get_queryset().exclude(id=current_user.id)
