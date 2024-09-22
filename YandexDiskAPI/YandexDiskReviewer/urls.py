from django.urls import path
from .views.home_page_view import HomePageView
from .views.file_view import FileView
urlpatterns = [
        path('', HomePageView.as_view(), name='index'),
        path('file/<str:public_key>/<str:path>/', FileView.as_view(), name='file'),
]
