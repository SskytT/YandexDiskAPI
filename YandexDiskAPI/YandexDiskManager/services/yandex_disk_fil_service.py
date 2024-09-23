import requests
import json
import urllib.parse


class YandexDiskFile:
    get_list_url = "https://cloud-api.yandex.net/v1/disk/public/resources?public_key="
    path_url = "&path="
    get_url = "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key="

    @staticmethod
    def get_file(public_key, path="/"):
        if "https" in public_key:
            final_url = YandexDiskFile.get_list_url + public_key
        else:
            final_url = (YandexDiskFile.get_list_url + public_key +
                         YandexDiskFile.path_url + path)
        response = requests.get(final_url)
        dict_data = json.loads(response.text)
        dict_result = dict()
        dict_result['name'] = dict_data['name']
        dict_result['public_key'] = dict_data['public_key']
        if dict_data['type'] == 'dir':
            dict_result['items'] = []
            for i in dict_data['_embedded']['items']:
                item = {"name": i["name"],
                        "path": i["path"], "type": i["type"]}
                if "file" in i:
                    item["file"] = i["file"]
                dict_result['items'].append(item)
        else:
            dict_result['items'] = []
            item = {"name": dict_data["name"],
                    "path": dict_data["path"], "type": dict_data["type"]}
            dict_result['items'].append(item)
        return dict_result

    @staticmethod
    def download_file(public_key, path=None):
        final_url = (YandexDiskFile.get_url + public_key + public_key +
                     YandexDiskFile.path_url + path)
        response = requests.get(final_url)
        dict_data = json.loads(response.text)
        return dict_data["href"]

