from django.contrib import admin

from .models import (UsersChat, Message, 
                     ChatParicipant, User, ImageFile, 
                     DefaulAvatars)


admin.site.register([
    UsersChat, Message, ChatParicipant, User, ImageFile,
    DefaulAvatars])
