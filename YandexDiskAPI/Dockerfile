# Используем базовый образ Python
FROM python:3.10-slim

# Устанавливаем зависимости для работы с PostgreSQL (если ты его используешь)
RUN apt-get update && apt-get install -y libpq-dev gcc

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY . /app

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Собираем статику (если есть)
RUN python manage.py collectstatic --noinput

# Запускаем сервер (замени 'projectname' на название своего проекта)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "YandexDiskAPI.wsgi:application"]
