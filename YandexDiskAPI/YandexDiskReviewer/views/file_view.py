from django.http import JsonResponse
from django.views.generic import View
from YandexDiskReviewer.services.yandex_disk_fil_service import YandexDiskFile
import base64


class FileView(View):
    def get(self, request, *args, **kwargs):
        public_key = kwargs.get('public_key', None)
        path = kwargs.get('path', None)
        print(public_key, path)
        public_key = base64.b64decode(public_key).decode('utf-8')
        path = base64.b64decode(path).decode('utf-8')
        print(public_key, path)
        dict_result = YandexDiskFile.get_file(public_key=public_key, path=path)
        return JsonResponse(dict_result)

    def download(self, request, *args, **kwargs):
        public_key = kwargs.get('public_key', None)
        path = kwargs.get('path', None)
        result = YandexDiskFile.download_file(public_key=public_key, path=path)
        return JsonResponse({"download": result})




