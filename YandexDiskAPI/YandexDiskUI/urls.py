from django.urls import path
from YandexDiskUI.views.home_page_view import HomePageView

url_patterns = [
    path('', HomePageView.as_view(), name='index'),
]
