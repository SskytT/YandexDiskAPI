import requests
import json
import urllib.parse


class YandexDiskFile:
    #часть пути для получения информации о файле
    get_list_url = "https://cloud-api.yandex.net/v1/disk/public/resources?public_key="
    #часть пути если мы используем public_key для пути
    path_url = "&path="
    #часть пути для получения ссылки
    get_url = "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key="
    #получаем информацию о файле
    @staticmethod
    def get_file(public_key, path="/"):
        #если https, то это public_key, а если без него, то это public_url
        if "https" in public_key:
            final_url = YandexDiskFile.get_list_url + public_key
        else:
            final_url = (YandexDiskFile.get_list_url + public_key +
                         YandexDiskFile.path_url + path)
        #получаем через api информацию файле
        response = requests.get(final_url)
        #преобразуем в json
        dict_data = json.loads(response.text)
        dict_result = dict()
        dict_result['name'] = dict_data['name']
        dict_result['public_key'] = dict_data['public_key']
        #если это папка записываем в подфайлы все файлы из items
        if dict_data['type'] == 'dir':
            dict_result['items'] = []
            for i in dict_data['_embedded']['items']:
                item = {"name": i["name"],
                        "path": i["path"], "type": i["type"]}
                if "file" in i:
                    item["file"] = i["file"]
                dict_result['items'].append(item)
        #если это файл то в подфайл запишем самого его
        else:
            dict_result['items'] = []
            item = {"name": dict_data["name"],
                    "path": dict_data["path"], "type": dict_data["type"]}
            dict_result['items'].append(item)
        return dict_result

    #функция для скачивания файла
    @staticmethod
    def download_file(public_key, path=None):
        #получаем ссылку для api
        final_url = (YandexDiskFile.get_url + public_key + public_key +
                     YandexDiskFile.path_url + path)
        #отправляем запрос на api яндекс диска
        response = requests.get(final_url)
        dict_data = json.loads(response.text)
        return dict_data["href"]

