FROM python:3.11.10-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/validator

COPY validator/production.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY validator .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 api:app
