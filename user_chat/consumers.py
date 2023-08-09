import json

from django.db.models import Count
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message, UsersChat, ChatParicipant


User = get_user_model()


class UserChatConsumer(AsyncWebsocketConsumer):
    async def fetch_messages(self, data):
        messages = await self.get_messages()
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        await self.send_message(content)

    async def new_message(self, data):
        author_id = data['from']
        author_user = await self.get_user(author_id)
        message = await self.create_new_message(
            user=author_user, content=data['message'])
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        await self.send_chat_message(content)

    @database_sync_to_async
    def get_user(self, author_id):
        return User.objects.filter(id=author_id).first()

    @database_sync_to_async
    def get_personal_chat(self, user_id):
        chat = UsersChat.objects.filter(
            participants__user__in=(user_id, self.user.id)
        ).annotate(participants_count=Count('participants')).filter(
            participants_count=2
        ).first()

        if chat:
            return chat

        chat = UsersChat.objects.create()
        chat.save()

        ChatParicipant.objects.create(chat=chat, user_id=user_id)
        ChatParicipant.objects.create(chat=chat, user_id=self.user.id)
        return chat


    
    @database_sync_to_async
    def create_new_message(self, user, content):
        message = Message.objects.create(
            author=user,
            content=content,
            chat=self.chat
        )
        return message
    
    @database_sync_to_async
    def get_messages(self):
        messages = (
            Message.objects.filter(chat=self.chat)
            .select_related('author').order_by('timestamp'))
        return list(messages)

    async def connect(self):
        self.user = self.scope['user']
        user_id = int(self.scope["url_route"]["kwargs"]["user_id"])

        self.chat = await self.get_personal_chat(user_id)
        
        self.chat_group_name = f"chat_{self.chat.id}"

        await self.channel_layer.group_add(
            self.chat_group_name, self.channel_name)

        await self.accept()

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result
    
    def message_to_json(self, message):
        return {
            'id': message.id,
            'author': message.author.id,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chat_group_name, self.channel_name)
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.commands[data['command']](self, data)

    async def send_message(self, message):
        await self.send(text_data=json.dumps(message))

    async def send_chat_message(self, message):
        print('new chat from socket')
        await self.channel_layer.group_send(
            self.chat_group_name, 
            {"type": "chat.message", 
             "message": message}
        )

    # Receive message from chat
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }
        