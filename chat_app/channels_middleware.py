from urllib.parse import parse_qs
from jwt import decode as jwt_decode
from channels.db import database_sync_to_async
from channels.auth import UserLazyObject
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs


User = get_user_model()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Middleware which populates scope["user"] in case of JWT autorization
    """
    @database_sync_to_async
    def get_user(self, token_string):
        try:
            decoded_data = jwt_decode(
                token_string, 
                settings.SECRET_KEY, 
                algorithms=settings.SIMPLE_JWT['ALGORITHM']
            )
            user = User.objects.get(id=decoded_data['user_id'])
            return user
        except:
            return AnonymousUser()

    def populate_scope(self, scope):
        if "user" not in scope:
            scope["user"] = UserLazyObject()

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        self.populate_scope(scope)
        query_string = scope["query_string"]
        query_params = query_string.decode()
        query_dict = parse_qs(query_params)
        token = query_dict["access"][0]
        scope["user"]._wrapped = await self.get_user(token)
        return await super().__call__(scope, receive, send)