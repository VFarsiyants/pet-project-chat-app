from .models import DefaulAvatars
import random


def get_random_avatar():
    default_avatars = list(DefaulAvatars.objects.all())
    return random.choice(default_avatars).image
