#!/bin/sh

# Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate --no-input

# start server
gunicorn --bind 0.0.0.0:8000 chat_app.wsgi
