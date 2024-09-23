from django.urls import path
from .views.file_view import FileView
urlpatterns = [
        path('file/<str:public_key>/<str:path>/', FileView.as_view(), name='file'),
        path('file/<str:public_key>/<str:path>/content', FileView.download, name='download_file')
]
