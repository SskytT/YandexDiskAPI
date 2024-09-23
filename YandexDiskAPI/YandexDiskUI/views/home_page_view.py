from django.views.generic import TemplateView

#контроллер для отображения шаблона главной страницы
class HomePageView(TemplateView):
    template_name = 'YandexDiskUI/index.html'