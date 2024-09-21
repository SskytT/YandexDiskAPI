from django.shortcuts import render
from django.http import JsonResponse

def my_api_view(request):
    data = {'key': 'value'}
    return JsonResponse(data)
