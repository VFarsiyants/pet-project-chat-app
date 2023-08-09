from django.contrib import admin

from .models import UsersChat, Message, ChatParicipant


admin.site.register([UsersChat, Message, ChatParicipant])
