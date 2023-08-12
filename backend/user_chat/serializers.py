from django.db.models import Q, Exists, OuterRef
from rest_framework import serializers

from .models import User, ChatParicipant, UsersChat, Message, ReadReceipt


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(label='User\'s avatar')
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 
                  'fullname', 'surname', 'status',
                  'avatar_url', 'online_status']
        extra_kwargs = {
            'password': {'write_only': True},
            'fullname': {'read_only': True},
            'surname': {'read_only': True},
            'status': {'read_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.file.url
        return ''
    

class UserContactsListSerializer(UserSerializer):
    avatar_url = serializers.SerializerMethodField(
        label='User\'s avatar')
    last_message = serializers.SerializerMethodField(
        label='Last message to user')
    unread_message_count = serializers.SerializerMethodField(
        label='Number of unread messages'
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 
                  'fullname', 'surname', 'status',
                  'avatar_url', 'online_status', 'last_message',
                  'unread_message_count']
        extra_kwargs = {
            'password': {'write_only': True},
            'fullname': {'read_only': True},
            'surname': {'read_only': True},
            'status': {'read_only': True}
        }

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.file.url
        return ''
    
    def get_unread_message_count(self, obj):
        messages = Message.objects.filter(
            ~Q(author=self.context['request'].user),
            ~Exists(ReadReceipt.objects.filter(
                message=OuterRef('id'),
                read_user=self.context['request'].user
            )),
            chat=self._get_user_chat(obj)
        )
        return messages.count()
    
    def get_last_message(self, obj):
        last_message = None

        chat_with_contact = self._get_user_chat(obj)

        if chat_with_contact:
            last_message = Message.objects.filter(
                chat=chat_with_contact
            ).order_by('-timestamp').first()
        return {
            'text': last_message.content,
            'timestamp': last_message.timestamp
        } if last_message else None
    
    def _get_user_chat(self, user):
        cur_user_chats = UsersChat.objects.filter(
            participants__user__in=[self.context['request'].user]
        )
        chat_with_contact = cur_user_chats.filter(
            participants__user__in=[user]
        ).first()
        return chat_with_contact
    

class CurrentUserEditSerializer(serializers.ModelSerializer):
    
    avatar_url = serializers.SerializerMethodField(label='User\'s avatar')
    
    class Meta:
        model = User
        fields = ['id', 'email', 'fullname', 'surname', 'status', 'avatar_url']
        extra_kwargs = {
            'email': {'read_only': True},
            'status': {'required': False}
        }

    def create(self, validated_data):
        raise AssertionError('Use this serializer only to edit name and status')
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.file.url
        return ''