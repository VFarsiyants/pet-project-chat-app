# Generated by Django 4.2.4 on 2023-08-16 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='online_status',
            field=models.BooleanField(default=False),
        ),
    ]
