import json

from django.db.models import Count, Exists, OuterRef, Q
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message, UsersChat, ChatParicipant, ReadReceipt


channel_layer = get_channel_layer()

User = get_user_model()

async def expose_new_message(user_id, message, to_user_id):
    await channel_layer.group_send(
        f"user_status_{user_id}", 
        {
            "type": "user.message.update",
            "data": {
                "content": message.content,
                "author": message.author_id,
                "timestamp": str(message.timestamp),
                "to_user": to_user_id
            }
        }
    )


class GetChatConsumerMixin:
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


class UserChatConsumer(GetChatConsumerMixin, AsyncWebsocketConsumer):
    async def fetch_messages(self, data):
        messages = await self.get_messages()
        content = {
            'command': 'messages',
            'data': {
                'messages': self.messages_to_json(messages)
            }
        }
        await self.send_message(content)

    async def new_message(self, data):
        author_id = data['from']
        author_user = await self.get_user(author_id)
        message = await self.create_new_message(
            user=author_user, content=data['message'])
        await expose_new_message(
            author_id, message, 
            int(self.scope["url_route"]["kwargs"]["user_id"]))
        content = {
            'command': 'new_message',
            'data': {
                'message': self.message_to_json(message)
            }
        }
        await self.send_chat_message(content)

    @database_sync_to_async
    def get_user(self, author_id):
        return User.objects.filter(id=author_id).first()
    
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
            .select_related('author').annotate(
                read=Exists(ReadReceipt.objects.filter(
                    message=OuterRef('id'),
                    read_user=self.user
                ))
            ).order_by('timestamp'))
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
            'timestamp': str(message.timestamp),
            'read': getattr(message, 'read', False),
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
        

class ContactsStatusConsumer(GetChatConsumerMixin, AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']

        self.users_contacts_ids = await self.get_users_contacts()

        for id in self.users_contacts_ids:
            await self.channel_layer.group_add(
                f"user_status_{id}", self.channel_name)
        
        await self.set_user_online(online_status=True)
        await self.accept()

        await self.channel_layer.group_send(
            f"user_status_{self.user.id}", 
            {
                "type": "user.status.update", 
                "user_id": self.user.id,
                "status": True
            }
        )

    async def disconnect(self, close_code):
        if self.user.id:
            await self.channel_layer.group_send(
                f"user_status_{self.user.id}", 
                {
                    "type": "user.status.update", 
                    "user_id": self.user.id,
                    "status": False
                }
            )
            
            for id in self.users_contacts_ids:
                await self.channel_layer.group_discard(
                    f"user_status_{id}", self.channel_name)

            await self.set_user_online(online_status=False)
            

    @database_sync_to_async
    def get_users_contacts(self):
        '''Returns list of users' ids with whom current user have chat'''
        chats = UsersChat.objects.filter(
            participants__user=self.user
        )
        users = ChatParicipant.objects.values_list(
            'user_id', flat=True
        ).filter(chat__in=chats).distinct()

        return list(users)
    
    @database_sync_to_async
    def set_user_online(self, online_status):
        '''Returns list of users' ids with whom current user have chat'''
        self.user.online_status = online_status
        self.user.save()

    async def user_status_update(self, event):
        status = event["status"]
        user_id = event["user_id"]

        await self.send(
            text_data=json.dumps({
                "command": "change_user_online",
                "data": {
                    "id": user_id,
                    "online": status
                }
            })
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.commands[data['command']](self, data)

    async def user_message_update(self, event):
        
        await self.send(            
            text_data=json.dumps({
                "command": "change_user_message",
                "data": event["data"]
            })
        )

    async def update_user_unread_message(self, data):
        message_id = data['data']['messageId']
        await self.create_read_receipt(message_id)
        chat_user = await self.get_message_author(message_id)
        chat_id = await self.get_personal_chat(chat_user.id)
        await self.send(
            text_data=json.dumps({
                "command": "update_user_unread_count",
                "data": {
                    "id": chat_user.id,
                    "unread_count": await self.get_unread_messages_count(
                        chat_id)
                }
            })
        )

    @database_sync_to_async
    def create_read_receipt(self, message_id):
        receipt = ReadReceipt.objects.create(
            message_id=message_id, read_user_id=self.user.id)
        return receipt

    @database_sync_to_async
    def get_unread_messages_count(self, chat_id):
        messages = Message.objects.filter(
            ~Q(author=self.user.id),
            ~Exists(ReadReceipt.objects.filter(
                message=OuterRef('id'),
                read_user_id=self.user.id
            )),
            chat=chat_id
        )
        return messages.count()

    @database_sync_to_async
    def get_message_author(self, message_id):
        message = Message.objects.get(pk=message_id)
        return message.author

    commands = {
        'update_user_unread_message': update_user_unread_message,
    }
