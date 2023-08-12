from django.db import transaction
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer, CurrentUserEditSerializer, \
    UserContactsListSerializer
from .services import get_random_avatar


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        random_image = get_random_avatar()
        user = serializer.save()
        user.avatar = random_image
        user.save()
        user.refresh_from_db()
        refresh = RefreshToken.for_user(user)

        data = {
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
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
    

class UserContactViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserContactsListSerializer

    def get_queryset(self):
        current_user = self.request.user
        return super().get_queryset().exclude(id=current_user.id)

class CurrentUserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CurrentUserEditSerializer

    def get_queryset(self):
        current_user_id = self.request.user.id
        return super().get_queryset().filter(id=current_user_id)

    def update(self, request, *args, **kwargs):
        user = self.get_queryset().get(id=self.request.user.id)
        data = request.data
        name_surname = data['name']
        data['fullname'], data['surname'] = name_surname.split(' ')
        if not data['fullname'].isalpha() or not data['surname'].isalpha():
            return Response(status=HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(user, data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(user, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            user._prefetched_objects_cache = {}

        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        kwargs['pk'] = self.request.user.id
        return super().retrieve(request, *args, **kwargs)
