from django.views.generic import TemplateView
import base64
from django.http import JsonResponse
from YandexDiskManager.services.yandex_disk_fil_service import YandexDiskFile  # Ваш файл с функцией get_file


class FileView(TemplateView):
    template_name = 'YandexDiskUI/file.html'
