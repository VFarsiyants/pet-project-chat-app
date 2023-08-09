from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from jwt import decode as jwt_decode
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED, HTTP_200_OK
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.serializers import (TokenRefreshSerializer, 
                                                  TokenObtainPairSerializer)
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from user_chat.models import User
from user_chat.serializers import UserSerializer


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken(
                'No valid token found in cookie \'refresh\'')
        
class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = User.objects.filter(email=attrs['email']).first()
        if user:
            user_srlz = UserSerializer(user)
            data['user'] = user_srlz.data
        return data 

class CookieTokenObtainPairView(TokenObtainPairView):
  serializer_class = UserTokenObtainPairSerializer

  def finalize_response(self, request, response, *args, **kwargs):
    if response.data.get('refresh'):
        refresh_cookie_max_age = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        response.set_cookie(
            'refresh', 
            response.data['refresh'], 
            max_age=refresh_cookie_max_age,
            httponly=True
        )
        del response.data['refresh']
    return super().finalize_response(request, response, *args, **kwargs)

class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
    
    def get(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh', '')
        serializer = self.get_serializer(data={
            'refresh': refresh_token
        })

        try:
            serializer.is_valid(raise_exception=True)
            decoded_data = jwt_decode(
                refresh_token, 
                settings.SECRET_KEY, 
                algorithms=settings.SIMPLE_JWT['ALGORITHM']
            )
            user = User.objects.get(id=decoded_data['user_id'])
        except TokenError as e:
            raise InvalidToken(e.args[0])
        except ObjectDoesNotExist:
            user = None

        data = serializer.validated_data
        data['user'] = UserSerializer(user).data
        return Response(serializer.validated_data, status=HTTP_200_OK)
    
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
            response.set_cookie('refresh', 
                                response.data['refresh'],
                                max_age=cookie_max_age,
                                samesite='None',
                                secure=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)
    