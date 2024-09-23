from django.http import JsonResponse
from django.views.generic import View
from YandexDiskManager.services.yandex_disk_fil_service import YandexDiskFile
import base64

#класс контроллера для работы с файлами
class FileView(View):
    #функция для просмотра файла
    def get(self, request, *args, **kwargs):
        public_key = kwargs.get('public_key', None)
        path = kwargs.get('path', None)
        # декодируем из base64
        public_key = base64.b64decode(public_key).decode('utf-8')
        path = base64.b64decode(path).decode('utf-8')
        print(public_key, path)
        #получаем данные о файле(и о вложенных если есть)
        dict_result = YandexDiskFile.get_file(public_key=public_key, path=path)
        return JsonResponse(dict_result)

    #функция для скачивания (для получения ссылки)
    @staticmethod
    def download(request, *args, **kwargs):
        public_key = kwargs.get('public_key', None)
        path = kwargs.get('path', None)
        #декодируем из base64
        public_key = base64.b64decode(public_key).decode('utf-8')
        path = base64.b64decode(path).decode('utf-8')
        #получаем ссылку
        result = YandexDiskFile.download_file(public_key=public_key, path=path)
        return JsonResponse({"download": result})




