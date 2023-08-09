from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/user_chat/(?P<user_id>\w+)/$", 
            consumers.UserChatConsumer.as_asgi()),
]