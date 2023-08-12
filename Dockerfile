FROM python:3.11.2-alpine

WORKDIR /backend

ENV PYTHONDONOTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY ./backend .
COPY ./requirements.txt ./requirements.txt
COPY ./frontend/dist ../frontend/dist
COPY ./docker-entrypoint.sh /usr/local/bin/


RUN sed -i 's/\r$//g' /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin//docker-entrypoint.sh

RUN apk add --update --no-cache --virtual .tmp-build-deps \
        libffi libffi-dev gcc libc-dev linux-headers postgresql-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install gunicorn
